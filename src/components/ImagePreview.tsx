'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai';
import { GoZoomIn, GoZoomOut } from 'react-icons/go';

interface ImagePreviewProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    setClosePreview: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
    src,
    alt = 'Preview Image',
    width = 500,
    height = 500,
    setClosePreview,
}) => {
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
    const handleRotateLeft = () => setRotate((prev) => prev - 90);
    const handleRotateRight = () => setRotate((prev) => prev + 90);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale <= 1) return;
        setDragging(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging) return;

        let newX = e.clientX - startPos.x;
        let newY = e.clientY - startPos.y;

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        const maxX = (scaledWidth - width) / 2;
        const minX = -maxX;
        const maxY = (scaledHeight - height) / 2;
        const minY = -maxY;

        newX = Math.min(Math.max(newX, minX), maxX);
        newY = Math.min(Math.max(newY, minY), maxY);

        setPosition({ x: newX, y: newY });
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setScale((prev) => Math.min(prev + 0.1, 3));
        } else {
            setScale((prev) => Math.max(prev - 0.1, 0.5));
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };
    return (
        <div
            onClick={() => setClosePreview(false)}
            className="absolute inset-0  flex flex-col items-center justify-center bg-black/50 z-50"
        >
            <div
                className="rounded overflow-hidden cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
                style={{ width: width, height: height }}
            >
                <Image
                    onClick={(e) => e.stopPropagation()}
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="object-cover w-full h-full "
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotate}deg)`,
                        transition: dragging ? 'none' : 'transform 0.2s',
                        cursor: scale > 1 ? 'grab' : 'default',
                    }}
                />
            </div>
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[15rem] p-1 h-[2rem] rounded-[10px] bg-black/60 text-gray-400 mt-5 flex items-center justify-center"
            >
                <i
                    onClick={handleRotateLeft}
                    className="ml-5 cursor-pointer hover:text-gray-300"
                >
                    <AiOutlineRotateLeft />
                </i>
                <i
                    onClick={handleRotateRight}
                    className="ml-5 cursor-pointer hover:text-gray-300"
                >
                    <AiOutlineRotateRight />
                </i>
                <i
                    onClick={handleZoomOut}
                    className="ml-5 cursor-pointer hover:text-gray-300"
                >
                    <GoZoomOut />
                </i>
                <i
                    onClick={handleZoomIn}
                    className="ml-5 cursor-pointer hover:text-gray-300"
                >
                    <GoZoomIn />
                </i>
            </div>
        </div>
    );
};

export default ImagePreview;
