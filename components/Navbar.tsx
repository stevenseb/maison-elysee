'use client';

import React, { useState } from 'react';
import { HoveredLink, Menu, MenuItem, ProductItem } from './ui/navbar-menu';
import { cn } from '@/lib/utils';

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn('fixed top-2 inset-x-0 mx-auto z-50 navbar opacity-86', className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="New">
          <div className="dropdown text-sm grid grid-cols-2 gap-5 p-2 opacity-1">
            <ProductItem
              title="Summer Styles For Women"
              href="https://maisonelysee.com"
              src="/SwimwearSummer.jpg"
              description="Check out our latest new fashions for the hot summer sun!"
            />
            <ProductItem
              title="Summer Styles For Men"
              href="https://maisonelysee.com"
              src="/SwimwearSummerMen.jpg"
              description="We have the hottest in men's summer fashion in stock for a limited time!"
            />
            <ProductItem
              title="Limited Edition Footwear"
              href="https://maisonelysee.com"
              src="/ShoesME.jpg"
              description="Don't miss out on these latest and greatest footwear &arr;"
            />
            <ProductItem
              title="Spring Closeout Up to 50% OFF!!!"
              href="https://maisonelysee.com"
              src="/SpringCO.jpg"
              description="Be sure to check out our closeout pricing on remaining stock!"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Women">
          <div className="dropdown flex flex-col space-y-4 text-sm">
            <HoveredLink href="/dresses-and-shirts">Dresses & Jumpsuits</HoveredLink>
            <HoveredLink href="/shirts-and-tops">Shirts & Tops</HoveredLink>
            <HoveredLink href="/jeans-and-pants">Jeans & Pants</HoveredLink>
            <HoveredLink href="/t-shirts">T-shirts</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Men">
          <div className="dropdown flex flex-col space-y-4 text-sm">
            <HoveredLink href="/t-shirts">T-shirts</HoveredLink>
            <HoveredLink href="/jeans-and-shirts">Jeans & Pants</HoveredLink>
            <HoveredLink href="/sweaters">Sweaters</HoveredLink>
            <HoveredLink href="/shorts">Shorts</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="My Account">
          <div className="dropdown flex flex-col space-y-4 text-sm">
            <HoveredLink href="/signup">Signup</HoveredLink>
            <HoveredLink href="/login">Login</HoveredLink>
            <HoveredLink href="/cart">Shopping Cart</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
