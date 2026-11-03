import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { buildRecords, root } from './seed-data.mjs';

const ink = rgb(0.067, 0.067, 0.086);
const muted = rgb(0.36, 0.36, 0.4);
const accent = rgb(0.051, 0, 0.643);
const line = rgb(0.88, 0.88, 0.855);
const paper = rgb(0.984, 0.984, 0.976);

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function sanitize(value) {
  return String(value)
    .replace(/ /g, ' ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/…/g, '...')
    .replace(/·/g, '|');
}

function wrap(text, font, size, maxWidth) {
  const words = sanitize(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function drawWrapped(page, text, options) {
  const { x, y, font, size, color, maxWidth, lineHeight } = options;
  let cursor = y;

  for (const textLine of wrap(text, font, size, maxWidth)) {
    page.drawText(textLine, { x, y: cursor, size, font, color });
    cursor -= lineHeight;
  }

  return cursor;
}

function rule(page, y) {
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.8,
    color: line
  });
}

async function buildPdf(record) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: paper
  });

  const enItem = record.title.en;
  let y = PAGE_HEIGHT - MARGIN;

  page.drawText('KENNEDY ACADEMY', {
    x: MARGIN,
    y,
    size: 9,
    font: bold,
    color: accent
  });
  page.drawText('El Biar, Algiers  |  kennedy@likour.tech', {
    x: MARGIN,
    y: y - 14,
    size: 8,
    font: regular,
    color: muted
  });
  page.drawText('PROGRAMME SYLLABUS', {
    x: PAGE_WIDTH - MARGIN - regular.widthOfTextAtSize('PROGRAMME SYLLABUS', 8),
    y,
    size: 8,
    font: regular,
    color: muted
  });

  y -= 34;
  rule(page, y);
  y -= 34;

  y = drawWrapped(page, enItem, {
    x: MARGIN,
    y,
    font: bold,
    size: 25,
    color: ink,
    maxWidth: CONTENT_WIDTH,
    lineHeight: 30
  });

  y -= 4;
  y = drawWrapped(page, record.lede.en, {
    x: MARGIN,
    y,
    font: regular,
    size: 11,
    color: muted,
    maxWidth: CONTENT_WIDTH,
    lineHeight: 16
  });

  y -= 18;
  page.drawText(record.title.fr, {
    x: MARGIN,
    y,
    size: 10,
    font: regular,
    color: accent
  });
  y -= 26;

  // Meta strip
  const meta = [
    ['NEXT COHORT', record.next_cohort.en],
    ['SCHEDULE', record.schedule.en],
    ['DURATION', `${record.duration_weeks} weeks`],
    ['SEATS LEFT', `${record.seats_left}`]
  ];
  const columnWidth = CONTENT_WIDTH / 4;

  meta.forEach(([label, value], index) => {
    const x = MARGIN + index * columnWidth;
    page.drawText(label, { x, y, size: 6.5, font: bold, color: muted });
    page.drawText(value, { x, y: y - 13, size: 9, font: regular, color: ink });
  });

  y -= 36;
  rule(page, y);
  y -= 24;

  page.drawText('WHAT YOU WILL BUILD', { x: MARGIN, y, size: 8, font: bold, color: accent });
  y -= 18;

  for (const outcome of record.outcomes.en.slice(0, 4)) {
    page.drawRectangle({ x: MARGIN, y: y + 3, width: 10, height: 1, color: accent });
    y = drawWrapped(page, outcome, {
      x: MARGIN + 18,
      y,
      font: regular,
      size: 9.5,
      color: ink,
      maxWidth: CONTENT_WIDTH - 18,
      lineHeight: 12
    });
    y -= 5;
  }

  y -= 14;
  rule(page, y);
  y -= 22;

  page.drawText('SYLLABUS OUTLINE', { x: MARGIN, y, size: 8, font: bold, color: accent });
  y -= 17;

  record.modules.en.slice(0, 6).forEach((module, index) => {
    const number = String(index + 1).padStart(2, '0');
    page.drawText(number, { x: MARGIN, y, size: 8, font: bold, color: accent });
    page.drawText(sanitize(module.title), {
      x: MARGIN + 24,
      y,
      size: 10,
      font: bold,
      color: ink
    });
    page.drawText(sanitize(module.description), {
      x: MARGIN + 24,
      y: y - 12,
      size: 8.5,
      font: regular,
      color: muted
    });
    y -= 28;
  });

  y -= 4;
  rule(page, y);
  y -= 22;

  page.drawText('CAPSTONE & STUDENT OUTPUT', {
    x: MARGIN,
    y,
    size: 8,
    font: bold,
    color: accent
  });
  y -= 17;
  page.drawText(sanitize(record.capstone.en.title), {
    x: MARGIN,
    y,
    size: 11,
    font: bold,
    color: ink
  });
  y -= 14;
  y = drawWrapped(page, record.capstone.en.description, {
    x: MARGIN,
    y,
    font: regular,
    size: 8.5,
    color: muted,
    maxWidth: CONTENT_WIDTH,
    lineHeight: 11
  });
  y -= 6;
  page.drawText('STUDENT OUTPUT', { x: MARGIN, y, size: 6.5, font: bold, color: muted });
  y -= 11;
  y = drawWrapped(page, record.capstone.en.deliverable, {
    x: MARGIN,
    y,
    font: regular,
    size: 8.5,
    color: ink,
    maxWidth: CONTENT_WIDTH,
    lineHeight: 11
  });

  // Footer
  const footerY = MARGIN;
  rule(page, footerY + 22);
  page.drawText('Placeholder syllabus - replace with the final PDF before launch.', {
    x: MARGIN,
    y: footerY + 8,
    size: 7,
    font: regular,
    color: muted
  });
  page.drawText(record.id, {
    x: PAGE_WIDTH - MARGIN - regular.widthOfTextAtSize(record.id, 7),
    y: footerY + 8,
    size: 7,
    font: regular,
    color: muted
  });

  return doc.save();
}

async function main() {
  const outputDir = path.join(root, 'public', 'brochures');
  await mkdir(outputDir, { recursive: true });

  const records = buildRecords();

  for (const record of records) {
    const bytes = await buildPdf(record);
    const filePath = path.join(outputDir, `${record.id}-syllabus.pdf`);
    await writeFile(filePath, bytes);
    console.log(`wrote public/brochures/${record.id}-syllabus.pdf (${bytes.byteLength} bytes)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
