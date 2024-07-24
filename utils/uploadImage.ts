import https from 'https';
import fs from 'fs';

const REGION = 'ny'; // Set to '' for the German region
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = REGION ? `${REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;
const STORAGE_ZONE_NAME = 'maison-elysee';
const ACCESS_KEY = process.env.NEXT_PUBLIC_BUNNY_CDN_ACCESS_KEY || process.env.BUNNY_CDN_ACCESS_KEY;

const uploadFile = (filePath: string, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);

    const options = {
      method: 'PUT',
      host: HOSTNAME,
      path: `/${STORAGE_ZONE_NAME}/${fileName}`,
      headers: {
        AccessKey: ACCESS_KEY,
        'Content-Type': 'application/octet-stream',
      },
    };

    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        console.log(chunk.toString('utf8'));
      });
      res.on('end', () => {
        resolve(`https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${fileName}`);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    readStream.pipe(req);
  });
};

export default uploadFile;
