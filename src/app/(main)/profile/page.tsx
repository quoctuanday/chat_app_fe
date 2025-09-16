'use client';

import { updateUser } from '@/api';
import Avatar from '@/components/Avatar';
import { uploadImage } from '@/helper/uploadImage';
import { User } from '@/schema/User';
import { useUser } from '@/store/socket';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { FaImages, FaPlus } from 'react-icons/fa';
import { IoIosCamera } from 'react-icons/io';
import { IoCloseOutline } from 'react-icons/io5';
import { LuSquareUser } from 'react-icons/lu';
import { MdOutlineFileUpload } from 'react-icons/md';

function ProfilePage() {
    const { userLoginData, setUserLoginData } = useUser();
    const [chooseForm, setchooseForm] = useState(false);
    const [uploadForm, setUpLoadForm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        console.log(selectedFile);
        try {
            setLoading(true);

            const url = await uploadImage(
                selectedFile,
                `avatars/${userLoginData?.user_id}`
            );

            await updateUser({ avatar_url: url });

            const updatedUser: User = {
                ...userLoginData!,
                avatar_url: url as string,
            };

            setUserLoginData(updatedUser);
            localStorage.setItem('userLoginData', JSON.stringify(updatedUser));

            setUpLoadForm(false);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {uploadForm && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 z-50"
                    onClick={() => setUpLoadForm(false)}
                >
                    <div
                        className="w-[24rem]  bg-white shadow-lg rounded-[5px] p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end">
                            <button
                                onClick={() => setUpLoadForm(false)}
                                className="p-2 rounded hover:bg-[#e0dede] cursor-pointer text-[1.25rem]"
                            >
                                <IoCloseOutline />
                            </button>
                        </div>
                        {previewUrl && (
                            <div className="flex items-center justify-center py-[1rem]">
                                <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-2 border-gray-400">
                                    <Image
                                        src={previewUrl}
                                        alt="preview avatar"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                            <button
                                onClick={handleChooseFile}
                                className="rounded-[5px] flex-1 flex items-center   justify-center cursor-pointer hover:bg-gray-300 shadow p-2"
                            >
                                <FaPlus />
                                <span className="ml-2">Chọn ảnh đại diện</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="rounded-[5px] flex-1 flex items-center ml-3 justify-center cursor-pointer bg-blue-500 hover:bg-blue-400 text-white shadow p-2"
                            >
                                <MdOutlineFileUpload />

                                <span className="ml-2">Tải ảnh lên</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative h-[16rem] bg-[var(--secondary)]">
                <div
                    onClick={() => setchooseForm(!chooseForm)}
                    className="absolute bottom-0 left-[5%] translate-y-1/2 cursor-pointer rounded-full  border-[4px] border-[var(--background)]"
                >
                    <div className="group">
                        <Avatar
                            username={userLoginData?.username || ''}
                            avatarUrl={userLoginData?.avatar_url}
                            w={168}
                            h={168}
                            classname=" bg-op rounded-full"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="absolute right-0 bottom-0 bg-[var(--secondary)] rounded-full text-[2rem] p-2">
                        <IoIosCamera />
                    </div>
                    {chooseForm && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-1/2 -translate-x-1/2 w-[13rem] rounded-[5px] p-2 shadow-sm font-medium"
                        >
                            <li className="list-none flex items-center hover:bg-[#e7e3e3] p-2 rounded-[5px]">
                                <LuSquareUser />
                                <span className="ml-2">Xem ảnh đại diện</span>
                            </li>
                            <li
                                onClick={() => {
                                    setUpLoadForm(true);
                                    setchooseForm(false);
                                }}
                                className="list-none flex items-center hover:bg-[#e7e3e3] p-2 rounded-[5px]"
                            >
                                <FaImages />
                                <span className="ml-2">Đổi ảnh đại diện</span>
                            </li>
                        </div>
                    )}
                </div>
            </div>
            <h1 className="text-[2rem] font-bold ml-[calc(5%+168px+1rem)]">
                {userLoginData?.username}{' '}
            </h1>
        </div>
    );
}

export default ProfilePage;
