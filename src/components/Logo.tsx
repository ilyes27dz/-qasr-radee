import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'text' | 'icon';
}

export default function Logo({ size = 'medium', variant = 'default' }: LogoProps) {
  const sizes = {
    small: {
      image: 32,
      title: 'text-base',
      subtitle: 'text-xs',
      container: 'gap-2',
    },
    medium: {
      image: 48,
      title: 'text-2xl',
      subtitle: 'text-sm',
      container: 'gap-3',
    },
    large: {
      image: 80,
      title: 'text-4xl',
      subtitle: 'text-lg',
      container: 'gap-4',
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  // Icon only variant
  if (variant === 'icon') {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition"></div>
        <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-3 shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-105">
          <Image 
            src="/LOGO.jpg" 
            alt="قصر الرضيع" 
            width={currentSize.image} 
            height={currentSize.image}
            className="rounded-lg"
          />
        </div>
      </div>
    );
  }

  // Text only variant
  if (variant === 'text') {
    return (
      <div className={`flex items-center ${currentSize.container}`}>
        <Image 
          src="/LOGO.jpg" 
          alt="قصر الرضيع" 
          width={currentSize.image} 
          height={currentSize.image}
          className="rounded-lg drop-shadow-lg"
        />
        <div className="flex flex-col">
          <h1 className={`${currentSize.title} font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight`}>
            قصر الرضيع
          </h1>
          <p className={`${currentSize.subtitle} font-bold text-purple-500`}>
            Baby Palace
          </p>
        </div>
      </div>
    );
  }

  // Default variant (with beautiful card)
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
      
      {/* Main card */}
      <div className={`relative flex items-center ${currentSize.container} bg-white rounded-2xl px-4 py-3 shadow-lg group-hover:shadow-xl transition-all`}>
        {/* Logo Image */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl blur-md opacity-50"></div>
          <div className="relative bg-white rounded-xl p-1 shadow-lg">
            <Image 
              src="/logo.png" 
              alt="قصر الرضيع" 
              width={currentSize.image} 
              height={currentSize.image}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <h1 className={`${currentSize.title} font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight`}>
            قصر الرضيع
          </h1>
          <p className={`${currentSize.subtitle} font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent`}>
            Baby Palace
          </p>
        </div>
      </div>
    </div>
  );
}
