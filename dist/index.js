"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyS3 = void 0;
class EasyS3 {
    constructor(options) {
        this.domain = options.domain;
        this.apiKeySecret = options.apiKeySecret;
    }
    upload(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                // Retrieve pre-signed URL to send file directly to S3…
                const signedRequestS3 = yield (yield fetch(`${this.domain}/u`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Authorization": `Secret: ${this.apiKeySecret}`,
                    },
                    body: JSON.stringify({
                        fileSize: file.size,
                        fileName: file.name,
                    }),
                })).json();
                // Build the form to send to S3…
                const form = new FormData();
                form.append("Content-Type", file.type);
                Object.entries(signedRequestS3.s3.fields).forEach(([k, v]) => {
                    form.append(k, v);
                });
                form.append("file", file);
                // Send file.
                return yield fetch(signedRequestS3.s3.url, {
                    method: "POST",
                    body: form,
                }).then((res) => {
                    if (res.ok) {
                        document.dispatchEvent(new CustomEvent("easy_s3_upload_complete", {
                            detail: signedRequestS3.misc,
                        }));
                        return signedRequestS3.misc;
                    }
                });
            })));
        });
    }
}
exports.EasyS3 = EasyS3;
exports.default = EasyS3;
