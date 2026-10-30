import React, { useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategorySection } from '../components/home/CategorySection';
import { BestsellersSection } from '../components/home/BestsellersSection';
import { SpecialPethaSection } from '../components/home/SpecialPethaSection';
import { WhyChooseSection } from '../components/home/WhyChooseSection';
import { HeritageStorySection } from '../components/home/HeritageStorySection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

export const HomePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fadeIn">
      <HeroSection />
      <CategorySection />
      <BestsellersSection />
      <SpecialPethaSection />
      <WhyChooseSection />
      <HeritageStorySection />
      <TestimonialsSection />
    </main>
  );
};
