const { Buffer } = require("node:buffer");
const { S3 } = require("@aws-sdk/client-s3");
const { makeIDs } = require("../utils");

function makeUploader() {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.IAM_ACCESS_KEY,
      secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY,
    },
  });

  return (param) => s3.putObject(param);
}

async function getResponse(ID, width) {
  const url = `https://picsum.photos/id/${ID}/${width}`;
  const response = await fetch(url);

  if (!response.ok) return;

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    buffer,
    ID,
  };
}

async function run(IDs, width) {
  const responsePromises = IDs.map((ID) => getResponse(ID, width));
  const responses = await Promise.all(responsePromises);

  const buffers = responses.filter((response) => response);
  const params = buffers.map((buffer) => ({
    Bucket: process.env.S3_BUCKET_NAME,
    Body: buffer.buffer,
    Key: `w${width}/${buffer.ID}.jpg`,
    ContentType: "image/jpeg",
  }));

  const upload = makeUploader();
  const promises = params.map(upload);

  await Promise.all(promises);

  const respondedIDs = buffers.map((buffer) => buffer.ID);
  return respondedIDs;
}

(async function () {
  const start = 1;
  const end = 100;
  const IDs = makeIDs(end, start);

  try {
    var [larges, mediums] = await Promise.all([run(IDs, 600), run(IDs, 300)]);
  } catch (error) {
    console.error(error);
  } finally {
    console.log(
      `${larges.length} 개의 이미지가 w600 사이즈로 업로드 되었습니다.`
    );
    console.log(
      `${mediums.length} 개의 이미지가 w300 사이즈로 업로드 되었습니다.`
    );

    IDs.filter((ID) => !larges.includes(ID)).forEach((ID) =>
      console.log(`이미지 ID (${ID}) 가 w600 사이즈로 업로드 되지 않았습니다.`)
    );
    IDs.filter((ID) => !mediums.includes(ID)).forEach((ID) =>
      console.log(`이미지 ID (${ID}) 가 w300 사이즈로 업로드 되지 않았습니다.`)
    );
  }
})();
