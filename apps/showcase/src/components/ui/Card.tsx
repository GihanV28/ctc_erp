import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'bordered';
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    const variantClasses = {
      default: 'bg-white shadow-lg rounded-xl',
      hover: 'bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
      bordered: 'bg-white border-2 border-gray-200 rounded-xl hover:border-violet-300 transition-colors duration-300'
    };

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], paddingClasses[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, link, onClick }) => {
  return (
    <Card variant="hover" className="cursor-pointer h-full" onClick={onClick}>
      <div className="flex flex-col items-center text-center h-full">
        <div className="text-violet-600 mb-4">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow mb-4">{description}</p>
        {link && (
          <a href={link} className="text-violet-600 font-medium hover:text-violet-700 transition-colors mt-auto">
            Learn More →
          </a>
        )}
      </div>
    </Card>
  );
};

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card variant="hover" className="h-full">
      <div className="flex flex-col items-start h-full">
        <div className="p-3 bg-violet-100 rounded-lg text-violet-600 mb-4">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">{description}</p>
      </div>
    </Card>
  );
};

export interface TestimonialCardProps {
  content: string;
  author: {
    name: string;
    position: string;
    company: string;
    avatar?: string;
  };
  rating: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ content, author, rating }) => {
  return (
    <Card variant="bordered" padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn('h-4 w-4 sm:h-5 sm:w-5', i < rating ? 'text-orange-500' : 'text-gray-300')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Content */}
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic flex-grow mb-4">&quot;{content}&quot;</p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-sm sm:text-base">
              {author.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{author.name}</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {author.position} at {author.company}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
