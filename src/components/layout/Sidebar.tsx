'use client';
import { useUser } from '@/store/socket';
import Image from 'next/image';
import { getInitials } from '@/helper/getInitials';
import React, { useEffect, useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { MdKeyboardArrowRight, MdOutlineMessage } from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';
import { CiLogout } from 'react-icons/ci';
import { updateUser } from '@/api';
import { useRouter } from 'next/navigation';
interface SidebarProps {
    className?: string;
}
export default function Sidebar({ className }: SidebarProps) {
    const router = useRouter();
    const { userLoginData, setUserLoginData } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [changeStatus, setChangeStatus] = useState(false);
    const [status, setStatus] = useState<'online' | 'offline' | 'busy' | null>(
        null
    );

    useEffect(() => {
        if (status !== null && userLoginData) {
            const updateStatus = async () => {
                try {
                    await updateUser({ status });
                    const updatedUser = { ...userLoginData, status };
                    setUserLoginData(updatedUser);
                    localStorage.setItem(
                        'userLoginData',
                        JSON.stringify(updatedUser)
                    );
                } catch (error) {
                    console.error('Update status failed:', error);
                }
            };

            updateStatus();
        }
    }, [status]);

    const handleLogOut = () => {
        localStorage.clear();
        router.push('./login');
    };
    return (
        <div
            className={`${className} flex flex-col justify-between text-white`}
        >
            <div className="">
                <div className="text-white text-[20px] font-semibold">
                    ChatApp
                </div>
                <div className="flex flex-col mt-[30px] text-[16px] font-normal">
                    <a
                        href="/message"
                        className="flex items-center px-[10px] py-[10px] rounded-[10px] hover:bg-[#282828]"
                    >
                        <i className="pr-2">
                            <MdOutlineMessage />
                        </i>
                        Đoạn chat
                    </a>
                    <a
                        href=""
                        className="flex items-center px-[10px] py-[10px] rounded-[10px] hover:bg-[#282828]"
                    >
                        <i className="pr-2">
                            <FaUserFriends />
                        </i>
                        Bạn bè
                    </a>
                    <a
                        href=""
                        className="flex items-center px-[10px] py-[10px] rounded-[10px] hover:bg-[#282828]"
                    >
                        <i className="pr-2">
                            <IoMdNotifications />
                        </i>
                        Thông báo
                    </a>
                </div>
            </div>
            <div
                className="h-[70px] relative bg-[var(--background)] px-[5px] rounded-[10px] flex items-center hover:bg-[var(--secondary)] cursor-pointer"
                onClick={() => {
                    setIsModalOpen(!isModalOpen);
                }}
            >
                {isModalOpen && (
                    <div
                        className="absolute w-[250px] shadow-sm z-10  bg-[var(--background)] bottom-[calc(100%+2%)] rounded-[5px] left-0 "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-[100px] bg-[var(--secondary)] rounded-t-[5px] relative">
                            <div className="absolute left-[5%] bottom-0 translate-y-[50%] w-[80px] h-[80px] rounded-full bg-[var(--primary)] border flex items-center justify-center ">
                                {userLoginData?.avatar_url ? (
                                    <Image
                                        src={userLoginData.avatar_url}
                                        alt="Avatar user"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-semibold text-[30px]">
                                        {getInitials(
                                            userLoginData?.username || ''
                                        )}
                                    </span>
                                )}

                                {/* Status */}
                                <div
                                    className={`absolute bottom-0 right-1 w-4 h-4 rounded-full ${
                                        userLoginData?.status === 'online'
                                            ? 'bg-[var(--online)]'
                                            : 'bg-[var(--offline)]'
                                    }`}
                                ></div>
                            </div>
                        </div>
                        <div className="mt-[40px] px-[10px] text-black">
                            <h1 className="font-bold text-[20px]">
                                {userLoginData?.username}
                            </h1>
                            <ul className="mt-[5px] px-3 rounded-[5px] bg-[var(--secondary)] min-h-[40px] relative ">
                                <div className="py-2">
                                    <a
                                        href="/profile"
                                        className=" py-1 px-1 flex items-center hover:bg-[#e7e3e3] rounded-[5px]"
                                    >
                                        <i>
                                            <RiPencilFill />
                                        </i>
                                        <span className="ml-2 text-[16px]">
                                            Chỉnh sửa hồ sơ
                                        </span>
                                    </a>
                                </div>
                                <div className="py-2 border-t ">
                                    {changeStatus && (
                                        <div className="absolute left-[103%] top-[20%] w-[13rem] z-11 p-[0.5rem] bg-[var(--background)] border-[1px] border-[#e7e5e5] shadow-sm rounded-[5px] ">
                                            <div className="flex items-center hover:bg-[#e7e3e3] rounded-[5px] p-1">
                                                <div
                                                    className={` w-4 h-4 rounded-full ${
                                                        userLoginData?.status ===
                                                        'online'
                                                            ? 'bg-[var(--online)]'
                                                            : 'bg-[var(--offline)]'
                                                    }`}
                                                ></div>{' '}
                                                <span className="text-[16px] ml-2">
                                                    {userLoginData?.status ===
                                                        'online' &&
                                                        'Đang hoạt động'}
                                                    {userLoginData?.status ===
                                                        'offline' && 'offline'}
                                                    {userLoginData?.status ===
                                                        'busy' && 'Vô hình'}
                                                </span>
                                            </div>
                                            <div className="h-[1px] bg-[#f8f8f8] my-2"></div>
                                            <div
                                                onClick={() => {
                                                    setStatus('online');
                                                }}
                                                className="flex items-center hover:bg-[#e7e3e3] rounded-[5px] p-1"
                                            >
                                                <div className=" w-4 h-4 rounded-ful bg-[var(--online)] rounded-full"></div>{' '}
                                                <span className="text-[16px] ml-2">
                                                    Đang hoạt động
                                                </span>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setStatus('busy');
                                                }}
                                                className="flex items-center hover:bg-[#e7e3e3] rounded-[5px] p-1"
                                            >
                                                <div className=" w-4 h-4 rounded-ful bg-[var(--offline)] rounded-full"></div>{' '}
                                                <span className="text-[16px] ml-2">
                                                    Vô hình
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <li
                                        onClick={() => {
                                            setChangeStatus(!changeStatus);
                                        }}
                                        className=" py-1 px-1 flex items-center justify-between hover:bg-[#e7e3e3] rounded-[5px]"
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={` w-4 h-4 rounded-full ${
                                                    userLoginData?.status ===
                                                    'online'
                                                        ? 'bg-[var(--online)]'
                                                        : 'bg-[var(--offline)]'
                                                }`}
                                            ></div>{' '}
                                            <span className="text-[16px] ml-2">
                                                {userLoginData?.status ===
                                                    'online' &&
                                                    'Đang hoạt động'}
                                                {userLoginData?.status ===
                                                    'offline' &&
                                                    'Chưa hoạt động'}
                                                {userLoginData?.status ===
                                                    'busy' && 'Vô hình'}
                                            </span>
                                        </div>

                                        <MdKeyboardArrowRight />
                                    </li>
                                </div>
                            </ul>
                            <ul className="mt-[5px] px-3 rounded-[5px] bg-[var(--secondary)] min-h-[40px]">
                                <div className="py-2">
                                    <li
                                        onClick={handleLogOut}
                                        className=" py-1 px-1 flex items-center hover:bg-[#e7e3e3] rounded-[5px]"
                                    >
                                        <i>
                                            <CiLogout />
                                        </i>
                                        <span className="ml-2 text-[16px]">
                                            Đăng xuất
                                        </span>
                                    </li>
                                </div>
                            </ul>
                            <div className="h-[10px] "></div>
                        </div>
                    </div>
                )}
                <div className="relative w-[50px] h-[50px] rounded-full bg-[var(--primary)] border flex items-center justify-center ">
                    {userLoginData?.avatar_url ? (
                        <Image
                            src={userLoginData.avatar_url}
                            alt="Avatar user"
                            fill
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-semibold text-lg">
                            {getInitials(userLoginData?.username || '')}
                        </span>
                    )}

                    {/* Status */}
                    <div
                        className={`absolute bottom-0 right-1 w-3 h-3 rounded-full ${
                            userLoginData?.status === 'online'
                                ? 'bg-[var(--online)]'
                                : 'bg-[var(--offline)]'
                        }`}
                    ></div>
                </div>

                <div className="ml-2 flex flex-col text-black select-none">
                    <h2 className="font-semibold">{userLoginData?.username}</h2>
                    <span className="text-[13px]">
                        {userLoginData?.status === 'online' && 'Đang hoạt động'}
                        {userLoginData?.status === 'offline' && 'Vô hình'}
                        {userLoginData?.status === 'busy' && 'Đang bận'}
                    </span>
                </div>
            </div>
        </div>
    );
}
