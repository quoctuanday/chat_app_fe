/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button, Form, FormProps, Input, message, Row, Col } from 'antd';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { register } from '@/api/index';
import { TfiReload } from 'react-icons/tfi';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

type FieldType = {
    username?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

function RegisterPage() {
    const router = useRouter();
    const [isRoting, setIsRoting] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);

    const drawCaptcha = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const captchaText = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
        setCaptcha(captchaText);

        ctx.font = '26px Poppins';
        ctx.fillStyle = '#2563eb';
        ctx.fillText(captchaText, 40, 35);

        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            ctx.lineTo(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            ctx.strokeStyle = '#93c5fd';
            ctx.stroke();
        }
    };

    useEffect(() => {
        drawCaptcha();
    }, []);

    const handleFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (inputRef.current?.value !== captcha) {
            setError('Captcha không hợp lệ. Mời nhập lại!');
            return;
        }
        const sendData = async () => {
            try {
                const response = await register(values);
                if (response) {
                    message.success('Đăng ký thành công!');
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            } catch (error: any) {
                if (error.response) {
                    switch (error.response.status) {
                        case 409:
                            message.error('Tài khoản đã tồn tại!');
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
        required: 'Bạn chưa nhập trường này.',
        types: {
            email: '${label} không hợp lệ!',
        },
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-[#e0f2fe] via-[#dbeafe] to-[#bfdbfe] flex items-center justify-center">
            <div className="w-[520px] rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg p-8">
                <h1 className="text-center text-3xl text-black mb-6">
                    Tạo tài khoản
                </h1>

                <Form
                    onFinish={handleFinish}
                    layout="vertical"
                    validateMessages={validateMessages}
                >
                    {/* Username */}
                    <Form.Item<FieldType>
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true }]}
                    >
                        <Input
                            placeholder="Nguyễn Văn A"
                            className="rounded-xl py-2"
                        />
                    </Form.Item>

                    {/* Phone + Email trên cùng một hàng */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Số điện thoại"
                                name="phoneNumber"
                                rules={[
                                    { required: true },
                                    {
                                        min: 9,
                                        message:
                                            'Số điện thoại phải có ít nhất 9 số.',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="090*******"
                                    className="rounded-xl py-2"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: 'email' }]}
                            >
                                <Input
                                    placeholder="example@gmail.com"
                                    className="rounded-xl py-2"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Password */}
                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Bạn chưa nhập mật khẩu!',
                            },
                            {
                                min: 8,
                                message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                            },
                            {
                                pattern:
                                    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/,
                                message:
                                    'Mật khẩu phải chứa chữ, số và ký tự đặc biệt!',
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Mật khẩu của bạn"
                            className="rounded-xl py-2"
                        />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item<FieldType>
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lại mật khẩu!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'Mật khẩu nhập lại không khớp!'
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập lại mật khẩu"
                            className="rounded-xl py-2"
                        />
                    </Form.Item>

                    {/* Captcha */}
                    <div className="mt-4">
                        <div className="border-2 border-dashed border-blue-300 rounded-lg w-full h-[60px] flex items-center justify-center">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-full"
                                width="200"
                                height="50"
                            ></canvas>
                        </div>
                        <div className="flex w-full mt-3">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Nhập captcha"
                                className="px-3 py-2 border border-blue-300 rounded-xl w-full text-center"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRoting(true);
                                    drawCaptcha();
                                    setTimeout(() => setIsRoting(false), 1000);
                                }}
                                className="ml-2 px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition"
                            >
                                <TfiReload
                                    className={`${
                                        isRoting ? 'animate-spin' : ''
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    {/* Submit */}
                    <Form.Item className="mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-blue-500 hover:bg-blue-600 rounded-xl mt-[10px] py-2 text-lg font-medium"
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>

                <p className="text-center text-sm text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link
                        href={'/login'}
                        className="text-blue-600 hover:underline"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
