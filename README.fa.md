# A3mess

‏ A3mess (خوانده می‌شود `اسمس`) یک برنامه مدیریت وضعیت پیامک‌های ارسالی توسط سرویس ارسال پیامک [magfa](http://messaging.magfa.com) است. این برنامه با ارائهٔ یک رابط API، استفاده از webservice مگفا را راحت‌تر می‌کند. همچنین A3mess به صورت متناوب وضعیت ارسال پیامک‌های ارسالی را کنترل کرده و امکان ارسال مجدد آن‌ها در صورت با مشکل مواجه شدن درخواست را دارد.

# ویژگی‌ها
- رابط API RESTful
- بررسی متناوب وضعیت ارسال پیامک
- تلاش مجدد برای ارسال پیامک‌های نرسیده به کاربر.
- رابط تحت وب جهت مشاهده وضعیت صف درخواست‌ها (با استفاده از [kue](https://github.com/Automattic/kue)
- قابلیت ارسال گزارش ارسال پیامک‌ها به [Segment](http://segment.com) 

## شروع
### پیش‌نیاز‌ها

برای شروع به کار A3mess لازم است که [Redis](http://redis.io)، [Nodejs](http://nodejs.org) و مدیر بسته‌های npm روی سیستم مورد نظر نصب شده باشد. همچنین پیشنهاد می‌شود که در وضعیت توسعه نرم‌افزار‌، از [nodemon](http://nodemon.io) نیز بهره بگیرید. 


### نصب
بعد از نصب پیش‌نیاز‌ها‌، می‌توانید با کلون کردن این مخزن گیت و یا دانلود یک نسخهٔ پایدار از [نسخه‌های منتشر شده](https://github.com/FoundersBuddy/a3mess/releases) شروع به نصب وابستگی‌های Node کنید:

```
git clone https://github.com/FoundersBuddy/a3mess.git
cd a3mess
npm install
```

### استفاده
#### تنظیمات

مشخصات شناسایی سرویس‌های [Magfa](http://messaging.magfa.com) و [Segment](http://segment.com) می‌تواند از فایل `configs/config.js` ویرایش شود.

#### اجرای سرویس‌ها
برای شروع به کار A3mess لازم است که رابط API و سرویس Consumer اجرا شوند. Consumer وظیفهٔ ارسال درخواست‌های پیامک به webservice مگفا را بر عهده دارد.

```
$ nodemon index.js           # Start API
$ ndoemon consumer.js        # Start consumer
```

### API

بعد از راه‌اندازی سرویس‌ها‌، می‌توانید از روی پورت `3883` به رابط API دسترسی داشته باشید. یک درخواست معتبر به این رابط به صورت زیر است:

```
Endpoint: /

Valid arguments:
  - to: Receiver's phone number (11 digits)
  - body: Message body
  - user_id: Optional user_id to trigger proper tracks over segment.

Type: POST
```
که متن پیامک از کلید body را برای دریافت کننده از کلید to ثبت می‌کند. مقدار کلید user_id یک کلید اختیاری است که در صورت موجود بودن جهت گزارش وضعیت پیامک روی [Segment](http://segment.com) مورد استفاده قرار می‌گیرد.

## Deployment
از آن‌جایی که هر دو سرویس API و Consumer جهت اجرای کامل A3mess مورد نیازاند‌، پیشنهاد می‌شود از یک ابزار مدیریت سرویس جهت اطمینان از وضعیت اجرای آن‌ها استفاده شود.
به عنوان مثال یه تعریف سرویس برای supervisord به صورت زیر خواهد بود:

```
command=node /PATH_TO_APP/index.js
user=afa
stdout_logfile=/var/log/a3mess/service.log
stderr_logfile=/var/log/a3mess/service.log
autostart=true
autoreload=true
startsecs=10
stopwaitsecs=600
killasgroup=true
priority=992
```

## Contributing

- در صورت موجود نبودن یک issue مرتبط با ایده یا مشکلتان، یک issue جدید ایجاد کنید. لطفا از کافی بودن توضیحات جهت سهولت در درک منظورتان توسط دیگران اطمینان حاصل کنید. 
- یک کپی از این مخزن بگیرید و یک branch از master بسازید. تغییراتتان را آن‌جا اعمال کنید. 
- یک تست بنویسید که نشان دهد پیاده‌سازی جدید‌تان کاملا درست کار می‌کند.
- یک درخواست (pull request) بفرستید.

## نسخه گذاری
برای نسخه‌گذاری این برنامه از [SemVer](http://semver.org) استفاده شده. برای دیدن نسخه‌های موجود می‌توانید به [برچسب‌های مخزن](https://github.com/FoundersBuddy/a3mess/releases) مراجعه کنید.

## توسعه دهندگان

برای مشاهده لیست کاملی از توسعه دهندگان می‌توانید به [لیست توسعه دهندگان](https://github.com/FoundersBuddy/a3mess/graphs/contributors) مراجعه کنید.

## لایسنس

این پروژه تحت شرایط لایسنس MIT منتشر شده است. برای اطلاعات بیشتر می‌توانید فایل [LICENSE.md](LICENSE.md) را مشاهده کنید.

## منابع

- [Magfa document](http://messaging.magfa.com/docs/manual/httpService-manual-940326.pdf)

