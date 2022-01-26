export interface EasyS3Args {
  domain: string;
  apiKeySecret: string;
}

export interface EasyS3UploadResponse {
  s3: Record<string, string>;
  misc: {
    file_name: string;
    file_size: number;
    public_url: string;
  };
}

export class EasyS3 {
  private readonly domain: string;
  private readonly apiKeySecret: string;

  constructor(options: EasyS3Args) {
    this.domain = options.domain;
    this.apiKeySecret = options.apiKeySecret;
  }

  async upload(files: File[]) {
    return Promise.all(
      files.map(async (file) => {
        // Retrieve pre-signed URL to send file directly to S3…
        const signedRequestS3: EasyS3UploadResponse = await (
          await fetch(`${this.domain}/u`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Authorization": `Secret: ${this.apiKeySecret}`,
            },
            body: JSON.stringify({
              fileSize: file.size,
              fileName: file.name,
            }),
          })
        ).json();

        // Build the form to send to S3…
        const form = new FormData();
        form.append("Content-Type", file.type);
        Object.entries(signedRequestS3.s3.fields).forEach(([k, v]) => {
          form.append(k, v);
        });
        form.append("file", file);

        // Send file.
        return await fetch(signedRequestS3.s3.url, {
          method: "POST",
          body: form,
        }).then((res) => {
          if (res.ok) {
            document.dispatchEvent(
              new CustomEvent("easy_s3_upload_complete", {
                detail: signedRequestS3.misc,
              })
            );

            return signedRequestS3.misc;
          }
        });
      })
    );
  }
}

export default EasyS3;
