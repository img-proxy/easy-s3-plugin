function EasyS3(selector, options) {
  if (!options.domain || !options.apiKeySecret) {
    throw new Error("Missing options for Easy S3.");
  }

  this.init = function () {
    document.querySelector(selector).onchange = async (event) => {
      await Promise.all(
        [...event.target.files].map(async (file) => {
          // Retrieve pre-signed URL to send file directly to S3…
          const signedRequestS3 = await (
            await fetch(`${options.domain}/u`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Authorization": `Secret: ${options.secret}`,
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
          form.append("file", file); // Must be the last element added!

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
            }
          });
        })
      );
    };
  };

  this.init();
}
