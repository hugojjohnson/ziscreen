import React from "react";

interface HoverImageProps {
    characters: string;
    src: string;
    alt: string;
}

const HoverImage: React.FC<HoverImageProps> = ({ characters, src, alt }) => {
    return (
        <div className="relative group inline-block w-40 h-40">
            <p className="text-8xl text-blue-500 mt-2">{characters}</p>
            <img
                src={src}
                alt={alt}
                className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
        </div>
    );
};

export default HoverImage;
