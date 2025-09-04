/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Input, Form, FormProps, Button, message } from 'antd';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { getUser, login } from '@/api/index';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

type FieldType = {
    usernameOrEmail?: string;
    pass?: string;
};

function LoginPage() {
    const router = useRouter();

    const handleFinish: FormProps<FieldType>['onFinish'] = (values) => {
        const sendData = async () => {
            try {
                const response = await login(values);
                if (response) {
                    message.success('Đăng nhập thành công!');
                    localStorage.setItem(
                        'token',
                        response.data.data.access_token
                    );
                    const profileRes = await getUser();
                    const user = profileRes.data.data;

                    localStorage.setItem('userLoginData', JSON.stringify(user));
                    setTimeout(() => {
                        router.push('/message');
                    }, 2000);
                }
            } catch (error: any) {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            message.error('Sai tài khoản hoặc mật khẩu!');
                            break;
                        case 500:
                            message.error('Lỗi máy chủ, vui lòng thử lại sau!');
                            break;
                        default:
                            message.error('Có lỗi xảy ra, vui lòng thử lại!');
                            break;
                    }
                } else {
                    message.error('Không thể kết nối đến máy chủ!');
                }
            }
        };
        sendData();
    };

    const validateMessages = {
        required: 'Bạn chưa nhập ${label}',
        types: {
            email: '${label} không hợp lệ!',
        },
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/auth/google';
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-[#e0f2fe] via-[#dbeafe] to-[#bfdbfe] flex items-center justify-center">
            <div className="w-[480px] rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg p-8">
                <h1 className="text-center text-3xl text-black mb-6">
                    Đăng nhập
                </h1>
                <Form
                    onFinish={handleFinish}
                    layout="vertical"
                    validateMessages={validateMessages}
                >
                    <Form.Item<FieldType>
                        label="Tên đăng nhập/Email"
                        name="usernameOrEmail"
                        rules={[{ required: true }]}
                    >
                        <Input
                            placeholder="example@gmail.com"
                            className="rounded-xl py-2"
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="pass"
                        rules={[{ required: true }]}
                    >
                        <Input.Password
                            placeholder="Mật khẩu của bạn"
                            className="rounded-xl py-2"
                        />
                    </Form.Item>

                    <div className="flex justify-between mb-4">
                        <Link
                            href={'/forgotPass'}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-blue-500 hover:bg-blue-600 rounded-xl py-2 text-lg font-medium"
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-2 text-gray-500">Hoặc</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <Button
                        htmlType="button"
                        onClick={handleGoogleLogin}
                        block
                        className="flex items-center justify-center rounded-xl py-2 text-lg font-medium border border-gray-300"
                    >
                        <FcGoogle className="mr-2 text-xl" /> Đăng nhập bằng
                        Google
                    </Button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Chưa có tài khoản?{' '}
                        <Link
                            href={'/register'}
                            className="text-blue-600 hover:underline"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
