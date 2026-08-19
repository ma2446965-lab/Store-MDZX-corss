# MDZX — Landing Page

صفحة هبوط (Landing Page) احترافية لكورس **MDZX** — كورس تعليمي متخصص في بناء المواقع والمتاجر الإلكترونية من الهاتف، مع أساسيات التجارة الإلكترونية والتسويق، في مسار واحد.

## الهيكل

```
index.html       الصفحة كاملة (Semantic HTML · RTL · عربي)
css/styles.css   نظام التصميم كامل (Dark/Light · Responsive · Mobile-first)
js/main.js       التفاعلات (بدون أي مكتبات خارجية)
```

## المميزات

- **Dark / Light mode** مع حفظ التفضيل، واحترام إعداد النظام أول زيارة.
- **هوية بصرية موحّدة**: خلفيات `#080808/#101010/#151515`، لون Accent ليموني كهربائي `#C1FF45`، خط Alexandria العربي.
- **17 قسمًا** من الـHero حتى الـFooter: Trust Strip، Pain Points، Big Value (BUILD→SELL→MARKET)، قيمة السوق، الفرص، المنهج (5 Modules + Timeline)، قبل/بعد، الموبايل أولًا، لمين/مش لمين، Bonus، مقارنة USP، FAQ، CTA النهائي.
- **Micro-interactions**: Scroll reveal، عدّادات أرقام، أزرار مغناطيسية، Card tilt خفيف، Spotlight يتبع المؤشر، Parallax خفيف، Accordion متحرك، Scrollspy، شريط تقدم القراءة — كلها Subtle وتحترم `prefers-reduced-motion`.
- **Mobile-first** ومختبر على المقاسات: 320 / 375 / 390 / 430 / 768 / 1024 / 1440 / 1920 — بدون أي overflow أفقي.
- **CTA واتساب مباشر** على الرقم 01148469161 برسالة جاهزة.
- **SEO**: وسوم Open Graph/Twitter، بيانات منظمة FAQPage (JSON-LD)، عناوين هرمية semantic.
- **بدون أي أسماء أدوات أو منصات، وبدون أي أسعار أو وعود دخل مضللة.**

## تشغيل محلي

أي خادم ملفات ثابت، مثل:

```bash
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```
