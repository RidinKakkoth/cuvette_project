// import { storage } from '../../../lib/firebaseConfig';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import formidable from 'formidable';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const form = new formidable.IncomingForm();
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error parsing form data' });
//       }

//       try {
//         const file = files.image[0]; 
//         const storageRef = ref(storage, `products/${file.originalFilename}`);
//         const snapshot = await uploadBytes(storageRef, file.filepath);

//         const downloadURL = await getDownloadURL(storageRef);

//         res.status(200).json({ downloadURL });
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ message: 'Error uploading image' });
//       }
//     });
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
