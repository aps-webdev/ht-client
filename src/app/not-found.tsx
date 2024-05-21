import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='w-full flex flex-col items-center justify-center mt-24'>
      <h1 className='text-6xl md:text-8xl lg:text-9xl'>404</h1>
      <div className='flex flex-col items-center justify-center'>
        <p className='text-3xl md:text-4xl lg:text-5xl mt-12'>Page Not Found</p>
        <p className='text-lg md:text-xl lg:text-2xl mt-8'>
          Sorry, the page you are looking for could not be found.
        </p>
        <Link
          href={'/'}
          className='flex items-center space-x-2 px-8 py-4 mt-12 bg-primary rounded-lg text-primary-foreground text-xl font-semibold hover:bg-primary/90'
          title='Return Home'>
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
