import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def draw_aicte_emblem(draw, center_x, center_y, size):
    """Draws a crisp AICTE Emblem with flame, book/wings, and Ashoka wheel."""
    r = size // 2
    # Background squircle
    draw.rounded_rectangle(
        [center_x - r, center_y - r, center_x + r, center_y + r],
        radius=int(r * 0.35),
        fill=(11, 17, 32),
        outline=(56, 189, 248),
        width=max(2, size // 24)
    )

    # Wheel dash circle
    chakra_r = int(r * 0.72)
    for angle in range(0, 360, 18):
        rad = math.radians(angle)
        x = center_x + chakra_r * math.cos(rad)
        y = center_y + chakra_r * math.sin(rad)
        dot_r = max(1.5, size // 45)
        draw.ellipse([x - dot_r, y - dot_r, x + dot_r, y + dot_r], fill=(148, 163, 184))

    # Open book / wings
    book_w = int(r * 0.58)
    book_y1 = center_y + int(r * 0.36)
    book_y2 = center_y + int(r * 0.18)
    draw.arc(
        [center_x - book_w, book_y1 - int(r*0.2), center_x, book_y1 + int(r*0.2)],
        start=0, end=180,
        fill=(56, 189, 248), width=max(2, size // 26)
    )
    draw.arc(
        [center_x, book_y1 - int(r*0.2), center_x + book_w, book_y1 + int(r*0.2)],
        start=0, end=180,
        fill=(56, 189, 248), width=max(2, size // 26)
    )
    draw.arc(
        [center_x - book_w, book_y2 - int(r*0.2), center_x, book_y2 + int(r*0.2)],
        start=0, end=180,
        fill=(241, 245, 249), width=max(2, size // 30)
    )
    draw.arc(
        [center_x, book_y2 - int(r*0.2), center_x + book_w, book_y2 + int(r*0.2)],
        start=0, end=180,
        fill=(241, 245, 249), width=max(2, size // 30)
    )

    # Pillar
    draw.line(
        [center_x, center_y - int(r * 0.1), center_x, center_y + int(r * 0.42)],
        fill=(245, 158, 11), width=max(3, size // 22)
    )

    # Sacred Flame
    flame_top = center_y - int(r * 0.55)
    flame_bot = center_y - int(r * 0.15)
    flame_w = int(r * 0.22)
    draw.polygon(
        [
            (center_x, flame_top),
            (center_x + flame_w, flame_top + int((flame_bot - flame_top)*0.6)),
            (center_x + int(flame_w*0.6), flame_bot),
            (center_x - int(flame_w*0.6), flame_bot),
            (center_x - flame_w, flame_top + int((flame_bot - flame_top)*0.6)),
        ],
        fill=(251, 191, 36)
    )
    draw.ellipse(
        [center_x - int(r*0.08), center_y - int(r*0.32), center_x + int(r*0.08), center_y - int(r*0.16)],
        fill=(254, 240, 138)
    )

    # Top-right live verified green badge
    pip_x = center_x + int(r * 0.72)
    pip_y = center_y - int(r * 0.72)
    pip_r = max(4, size // 14)
    draw.ellipse([pip_x - pip_r, pip_y - pip_r, pip_x + pip_r, pip_y + pip_r], fill=(16, 185, 129))
    draw.ellipse([pip_x - int(pip_r*0.4), pip_y - int(pip_r*0.4), pip_x + int(pip_r*0.4), pip_y + int(pip_r*0.4)], fill=(255, 255, 255))

def generate_icons():
    master = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(master)
    draw_aicte_emblem(draw, 256, 256, 440)

    apple_icon = master.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save("public/apple-touch-icon.png", "PNG")

    icon16 = master.resize((16, 16), Image.Resampling.LANCZOS)
    icon32 = master.resize((32, 32), Image.Resampling.LANCZOS)
    icon48 = master.resize((48, 48), Image.Resampling.LANCZOS)
    icon32.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    icon32.save("app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Generated favicon.ico and apple-touch-icon.png")

def generate_og_image():
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (6, 10, 18))
    
    # Ambient Optical Orbs
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    
    # Cyan optical flare
    glow_draw.ellipse([-50, -50, 600, 500], fill=(14, 165, 233, 40))
    # Indigo optical flare
    glow_draw.ellipse([700, 150, 1250, 650], fill=(99, 102, 241, 40))
    # Emerald optical flare
    glow_draw.ellipse([300, 300, 900, 620], fill=(16, 185, 129, 25))
    
    glow = glow.filter(ImageFilter.GaussianBlur(100))
    img = Image.alpha_composite(img, glow)
    
    draw = ImageDraw.Draw(img)
    
    # Outer Glass Specular Border
    draw.rounded_rectangle([24, 24, W - 24, H - 24], radius=28, outline=(56, 189, 248, 60), width=2)
    draw.rounded_rectangle([26, 26, W - 26, H - 26], radius=26, outline=(255, 255, 255, 20), width=1)

    # Fonts
    font_dir = r"C:\Windows\Fonts"
    f_badge = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 17)
    f_title1 = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 48)
    f_title2 = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 48)
    f_subtitle1 = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 23)
    f_subtitle2 = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 20)
    f_card_tag = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 16)
    f_card_h = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 18)
    f_card_sub = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 14)
    f_footer_url = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 19)
    f_footer_meta = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 18)

    # 1. Top Badges Row
    badge_y = 60
    badge_h = 38

    # Badge 1: SIH 2026 • PS 26261
    b1_text = "SIH 2026 • PS 26261"
    b1_bbox = f_badge.getbbox(b1_text)
    b1_w = (b1_bbox[2] - b1_bbox[0]) + 48
    draw.rounded_rectangle([68, badge_y, 68 + b1_w, badge_y + badge_h], radius=19, fill=(15, 23, 42, 220), outline=(56, 189, 248, 90), width=1)
    draw.ellipse([84, badge_y + 13, 96, badge_y + 25], fill=(245, 158, 11))
    draw.text((106, badge_y + 8), b1_text, font=f_badge, fill=(241, 245, 249))

    # Badge 2: AICTE • MINISTRY OF EDUCATION
    b2_text = "AICTE • MINISTRY OF EDUCATION, GOVT. OF INDIA"
    b2_bbox = f_badge.getbbox(b2_text)
    b2_w = (b2_bbox[2] - b2_bbox[0]) + 36
    b2_x = 68 + b1_w + 18
    draw.rounded_rectangle([b2_x, badge_y, b2_x + b2_w, badge_y + badge_h], radius=19, fill=(15, 23, 42, 220), outline=(147, 51, 234, 100), width=1)
    draw.text((b2_x + 18, badge_y + 8), b2_text, font=f_badge, fill=(192, 132, 252))

    # Badge 3: DPI Bridge Status
    b3_text = "DPI BRIDGE: 6/6 AUTHORITIES ONLINE"
    b3_bbox = f_badge.getbbox(b3_text)
    b3_w = (b3_bbox[2] - b3_bbox[0]) + 44
    b3_x = W - 68 - b3_w
    draw.rounded_rectangle([b3_x, badge_y, b3_x + b3_w, badge_y + badge_h], radius=19, fill=(6, 78, 59, 180), outline=(16, 185, 129, 120), width=1)
    draw.ellipse([b3_x + 16, badge_y + 13, b3_x + 28, badge_y + 25], fill=(16, 185, 129))
    draw.text((b3_x + 36, badge_y + 8), b3_text, font=f_badge, fill=(52, 211, 153))

    # 2. Left AICTE Emblem
    emblem_x = 145
    emblem_y = 250
    draw_aicte_emblem(draw, emblem_x, emblem_y, 140)

    # 3. Main Headline & Subtitle with dynamic positioning
    t1 = "AICTE Regulatory Scrutiny "
    t2 = "Intelligence"
    t1_bbox = f_title1.getbbox(t1)
    t1_w = t1_bbox[2] - t1_bbox[0]

    text_x = 245
    title_y = 175
    draw.text((text_x, title_y), t1, font=f_title1, fill=(255, 255, 255))
    draw.text((text_x + t1_w, title_y), t2, font=f_title2, fill=(56, 189, 248))

    draw.text((text_x, 240), "Evidence-Linked Forensic Intelligence & Institutional Compliance Workstation", font=f_subtitle1, fill=(203, 213, 225))
    draw.text((text_x, 276), "Approval Process Handbook (APH 2024–2027) • Neural Forensics • CAD Blueprint CV", font=f_subtitle2, fill=(148, 163, 184))

    # 4. Feature Architecture Cards (4 Glass Pods)
    cards = [
        ("NEURAL FORENSICS", "TruFor & ELA Splicing", "Pixel-level 8x8 DCT BAG", (244, 63, 94)),
        ("CAD BLUEPRINT CV", "Shoelace Area Engine", "RDP scale calibration", (14, 165, 233)),
        ("GHOST FACULTY", "ArcFace 512-D Vectors", "EPFO ECR wage audits", (168, 85, 247)),
        ("AUDIT TRAIL", "SHA-256 Chained Ledger", "Merkle root verification", (16, 185, 129)),
    ]

    card_y = 350
    card_w = 246
    card_h = 135
    start_x = 68
    gap = 26

    for i, (tag, headline, sub, accent) in enumerate(cards):
        cx = start_x + i * (card_w + gap)
        # Translucent glass card
        draw.rounded_rectangle([cx, card_y, cx + card_w, card_y + card_h], radius=18, fill=(15, 23, 42, 230), outline=(51, 65, 85, 160), width=1)
        # Top 3px accent line
        draw.rounded_rectangle([cx + 16, card_y, cx + card_w - 16, card_y + 3], radius=2, fill=accent)
        # Text inside
        draw.text((cx + 18, card_y + 18), tag, font=f_card_tag, fill=accent)
        draw.text((cx + 18, card_y + 54), headline, font=f_card_h, fill=(241, 245, 249))
        draw.text((cx + 18, card_y + 88), sub, font=f_card_sub, fill=(148, 163, 184))

    # 5. Footer Bar
    footer_y = 525
    draw.line([68, footer_y, W - 68, footer_y], fill=(51, 65, 85, 140), width=1)
    
    # Left footer: URL with green pip
    draw.ellipse([70, footer_y + 28, 80, footer_y + 38], fill=(16, 185, 129))
    draw.text((92, footer_y + 22), "https://aicte-scrutiny.vercel.app", font=f_footer_url, fill=(56, 189, 248))
    
    # Right footer: Meta info
    meta_text = "All 8 AICTE Regional Zones Supported • Bilingual (English & Hindi)"
    meta_bbox = f_footer_meta.getbbox(meta_text)
    meta_w = meta_bbox[2] - meta_bbox[0]
    draw.text((W - 68 - meta_w, footer_y + 22), meta_text, font=f_footer_meta, fill=(148, 163, 184))

    img.save("public/og-image.png", "PNG", optimize=True)
    print("Generated perfected public/og-image.png (1200x630)")

if __name__ == "__main__":
    generate_icons()
    generate_og_image()
