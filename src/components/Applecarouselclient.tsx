"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Slide } from "@/types/banner";

interface AppleCarouselClientProps {
    slides: Slide[];
}

export default function AppleCarouselClient({
    slides,
}: AppleCarouselClientProps) {
    const cards = slides.map((slide) => ({
        category: "",
        title: "",
        src: slide.img,
        href: slide.url,
    }));

    const carouselItems = cards.map((card, index) => (
        <Card key={`${card.src}-${index}`} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full">

            <Carousel items={carouselItems} />
        </div>
    );
}