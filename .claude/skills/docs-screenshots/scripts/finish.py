# Turn a raw capture into a docs image: blur the private areas, then wrap it in the
# Mac-style window frame used across the docs.
#
#   python3 -I finish.py raw.png docs/section/img/name.png [--no-frame]
#
# Blur areas come from `raw.png.blur.json` (written by lib.js captureClip), as
# [x, y, width, height] boxes relative to the raw image. Needs Pillow.
import json, os, sys
from PIL import Image, ImageDraw, ImageFilter

# Frame spec — keep these values identical across projects so every image matches.
M, BAR, R = 24, 34, 12                                      # outer margin, title-bar height, corner radius
BG, BARC, LINE = (252, 252, 252), (246, 246, 246), (227, 227, 230)
DOTS = [(13.5, (255, 95, 87)), (31, (254, 188, 46)), (48.5, (40, 200, 64))]
BLUR_RADIUS, BLUR_PAD = 6, 3


def blur(im, boxes):
    for x, y, w, h in boxes:
        box = (max(0, int(x) - BLUR_PAD), max(0, int(y) - BLUR_PAD),
               min(im.width, int(x + w) + BLUR_PAD), min(im.height, int(y + h) + BLUR_PAD))
        if box[2] <= box[0] or box[3] <= box[1]:
            continue                                        # outside the captured area
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(BLUR_RADIUS)), box)
    return im


def frame(shot):
    w, h = shot.size
    win_w, win_h = w, h + BAR + 1
    W, H = win_w + 2 * M, win_h + 2 * M
    canvas = Image.new('RGB', (W, H), BG)
    shadow = Image.new('L', (W, H), 0)
    ImageDraw.Draw(shadow).rounded_rectangle((M, M + 4, M + win_w, M + win_h + 4), R, fill=110)
    canvas.paste(Image.new('RGB', (W, H), (0, 0, 0)), (0, 0), shadow.filter(ImageFilter.GaussianBlur(12)))

    win = Image.new('RGB', (win_w, win_h), (255, 255, 255))
    d = ImageDraw.Draw(win)
    d.rectangle((0, 0, win_w, BAR), fill=BARC)
    d.line((0, BAR, win_w, BAR), fill=LINE)
    for cx, col in DOTS:
        d.ellipse((cx - 5.5, BAR / 2 - 5.5, cx + 5.5, BAR / 2 + 5.5), fill=col)
    win.paste(shot, (0, BAR + 1))

    mask = Image.new('L', (win_w * 4, win_h * 4), 0)        # draw at 4x for smooth corners
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, win_w * 4 - 1, win_h * 4 - 1), R * 4, fill=255)
    canvas.paste(win, (M, M), mask.resize((win_w, win_h), Image.LANCZOS))
    return canvas


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if len(args) != 2:
        sys.exit('usage: finish.py raw.png out.png [--no-frame]')
    src, dst = args
    im = Image.open(src).convert('RGB')
    boxes = json.load(open(src + '.blur.json')) if os.path.exists(src + '.blur.json') else []
    im = blur(im, boxes)
    if '--no-frame' not in sys.argv:
        im = frame(im)
    os.makedirs(os.path.dirname(os.path.abspath(dst)), exist_ok=True)
    tmp = dst + '.tmp.png'                                  # write then rename, so a live preview
    im.save(tmp, optimize=True)                             # never serves a half-written file
    os.replace(tmp, dst)
    print(dst, im.size, f'{len(boxes)} area(s) blurred')


main()
