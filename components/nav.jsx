import React from 'react'
import SearchBar from './searchbar'
import Image from 'next/image'
import NavLogo from 'public/nav-logo.svg'

export default function Nav({img, name}) {
  return (
    <div className='w-full px-8 py-6 flex items-center'>
        <div className='w-[19vw]'>
            <Image 
                src={NavLogo}
                alt="Nav Logo"
                width={127}
                height={60}
                objectFit='cover'
                className='px-3'
            />
        </div>
        <div className='flex flex-1 justify-between'>
            <SearchBar />
            <Image 
                src={img} 
                alt={name}
                width={40}
                height={40}
                className='rounded-full bg-gray-400'
            />
        </div>
       
    </div>
  )
}
