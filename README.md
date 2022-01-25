# Easy S3 for img-proxy.com

This tiny JS script allows uploading files to img-proxy.com more easily.

## How to use

1. Include the library in your HTML page:
```html
<script type="text/javascript" src="https://unpkg.com/@img-proxy.com/easy-s3-plugin@1.0.1/dist/easy-s3.min.js"></script>
```

2. Create an `<input type="file">` and specify an ID (as well as other options [as permitted by the API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/file)). 
```html
<label for="easy_s3">File to upload:</label>
<input type="file" id="easy_s3" name="file" multiple>
```

3. Then, in your `<script>` section, instantiate a new EasyS3 object:

```javascript
const easyS3 = new EasyS3("#easy_s3", {
    domain: 'https://yourdomain.img-pro.xyz',
    apiKeySecret: 'YOUR_API_KEY_SECRET'
})
```

Finally, you can "listen" to uploaded files using:
```javascript
document.addEventListener('easy_s3_upload_complete', function(event) {
    console.log(event.detail);
})
```

(c) 2022 – img-proxy.com