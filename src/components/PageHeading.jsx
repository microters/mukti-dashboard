import React from 'react';
import { Link } from 'react-router-dom';

const PageHeading = ({ title, breadcrumbs }) => {
  return (
    <div className='block sm:flex items-center justify-between gap-9 mb-5 mt-1'>
      <h2 className='font-inter font-semibold text-lg text-[#4C4D5D]'>{title}</h2>
      <ul className='flex items-center gap-5'>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={index}
            className={`font-inter font-normal text-sm text-M-text-color relative before:content-["\\203A"] before:-right-3 before:top-1/2 before:-translate-y-1/2 before:absolute last:before:hidden before:text-lg ${index === breadcrumbs.length - 1 ? 'last:text-M-text-color/50' : ''}`}
          >
            {breadcrumb.url ? (
              <Link to={breadcrumb.url} className='hover:text-M-primary-color transition-all duration-200'>
                {breadcrumb.label}
              </Link>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageHeading;