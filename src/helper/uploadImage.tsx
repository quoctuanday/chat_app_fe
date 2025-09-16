import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

export async function uploadImage(
    files: File | File[],
    path: string
): Promise<string | string[]> {
    if (!Array.isArray(files)) {
        const storageRef = ref(storage, `${path}/${files.name}`);
        await uploadBytes(storageRef, files);
        return await getDownloadURL(storageRef);
    } else {
        const urls = await Promise.all(
            files.map(async (file) => {
                const storageRef = ref(storage, `${path}/${file.name}`);
                await uploadBytes(storageRef, file);
                return await getDownloadURL(storageRef);
            })
        );
        return urls;
    }
}
