
const components = {
  announcementStrip: () => {
    return `
      <div class="bg-[#FF0000] py-2 overflow-hidden relative h-10 flex items-center" x-data="{ messages: ['Build walls that feel like YOU', 'Free shipping on prepaid orders', 'Custom designs included', 'Upgrade your wall today'] }">
        <div class="flex whitespace-nowrap gap-20 px-10 animate-marquee">
          <template x-for="i in 4" :key="i">
            <template x-for="msg in messages" :key="msg">
              <span class="text-white text-sm font-bold tracking-wider uppercase inline-block" x-text="msg"></span>
            </template>
          </template>
        </div>
      </div>
    `;
  },

  header: (cartCount = 0) => {
    return `
      <header
        class="fixed top-12 left-0 right-0 z-[100] transition-all duration-500"
        :class="isScrolled ? 'bg-white/90 backdrop-blur-md shadow-2xl py-4' : 'bg-transparent py-8'"
        x-data="{ 
          isScrolled: false, 
          isMobileMenuOpen: false, 
          activeDropdown: null,
          categories: [
            { name: 'Cyberpunk', slug: 'cyberpunk' },
            { name: 'Abstract', slug: 'abstract' },
            { name: 'Retro', slug: 'retro' },
            { name: 'Nature', slug: 'nature' },
            { name: 'Space', slug: 'space' }
          ],
          init() {
            window.addEventListener('scroll', () => this.isScrolled = window.scrollY > 50);
          }
        }"
      >
        <div class="container mx-auto px-6 flex items-center justify-between">
          <a href="/index.html" class="flex items-center">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/9d2919b8-9e68-4c70-9a71-6175f2e26831/Gemini_Generated_Image_rmm9rsrmm9rsrmm9-removebg-preview-1767885732389.png?width=8000&height=8000&resize=contain" 
              alt="WALLIFIED" 
              class="h-10 w-auto object-contain transition-all duration-300 hover:scale-105"
              style="filter: brightness(0) drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))"
            />
          </a>

          <nav class="hidden lg:flex items-center gap-8">
            <div class="relative group" @mouseenter="activeDropdown = 'shop'" @mouseleave="activeDropdown = null">
              <button class="flex items-center gap-1 text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">
                Shop Posters <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
              </button>
              <div x-show="activeDropdown === 'shop'" x-transition class="absolute top-full left-0 w-72 bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.1)] py-8 px-6 z-50 border-t-4 border-[#FF0000]">
                <div class="grid grid-cols-1 gap-4">
                  <template x-for="cat in categories" :key="cat.slug">
                    <a :href="'/shop.html?category=' + cat.slug" class="group flex items-center justify-between text-black hover:text-[#FF0000] transition-colors">
                      <span class="text-[10px] font-black uppercase tracking-[0.2em]" x-text="cat.name"></span>
                      <div class="w-0 group-hover:w-4 h-[2px] bg-[#FF0000] transition-all duration-300"></div>
                    </a>
                  </template>
                  <a href="/shop.html" class="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-zinc-400 hover:text-black transition-colors">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">View All Posters</span>
                  </a>
                </div>
              </div>
            </div>

            <a href="/collections.html" class="text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">Collections</a>
            <a href="/custom.html" class="text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">Custom Design</a>
            
            <div class="relative group" @mouseenter="activeDropdown = 'help'" @mouseleave="activeDropdown = null">
              <button class="flex items-center gap-1 text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">
                Help Center <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
              </button>
              <div x-show="activeDropdown === 'help'" x-transition class="absolute top-full left-0 w-72 bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.1)] py-8 px-6 z-50 border-t-4 border-[#FF0000]">
                <div class="grid grid-cols-1 gap-4">
                  <a href="/shipping-policy.html" class="group flex items-center justify-between text-black hover:text-[#FF0000] transition-colors">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Shipping Policy</span>
                    <div class="w-0 group-hover:w-4 h-[2px] bg-[#FF0000] transition-all duration-300"></div>
                  </a>
                  <a href="/refund-policy.html" class="group flex items-center justify-between text-black hover:text-[#FF0000] transition-colors">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Refund Policy</span>
                    <div class="w-0 group-hover:w-4 h-[2px] bg-[#FF0000] transition-all duration-300"></div>
                  </a>
                  <a href="/privacy-policy.html" class="group flex items-center justify-between text-black hover:text-[#FF0000] transition-colors">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em]">Privacy Policy</span>
                    <div class="w-0 group-hover:w-4 h-[2px] bg-[#FF0000] transition-all duration-300"></div>
                  </a>
                </div>
              </div>
            </div>

            <a href="/contact.html" class="text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">Contact Us</a>
          </nav>

          <div class="flex items-center gap-6">
            <button class="text-black hover:text-[#FF0000] transition-colors"><i data-lucide="search" class="w-5 h-5"></i></button>
            <a href="/cart.html" class="relative text-black hover:text-[#FF0000] transition-colors">
              <i data-lucide="shopping-cart" class="w-5 h-5"></i>
              <span x-show="cartCount > 0" class="absolute -top-2 -right-2 bg-[#FF0000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center" x-text="cartCount"></span>
            </a>
            <button class="lg:hidden text-black" @click="isMobileMenuOpen = true"><i data-lucide="menu" class="w-6 h-6"></i></button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div x-show="isMobileMenuOpen" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="transition ease-in duration-300" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full" class="fixed inset-0 bg-white z-[200] p-8 flex flex-col">
          <div class="flex justify-between items-center mb-12">
            <a href="/index.html" class="flex items-center">
              <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/9d2919b8-9e68-4c70-9a71-6175f2e26831/Gemini_Generated_Image_rmm9rsrmm9rsrmm9-removebg-preview-1767885732389.png?width=8000&height=8000&resize=contain" alt="WALLIFIED" class="h-10 w-auto object-contain" style="filter: brightness(0) drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))" />
            </a>
            <button @click="isMobileMenuOpen = false"><i data-lucide="x" class="w-8 h-8"></i></button>
          </div>
          <div class="flex flex-col gap-6">
            <a href="/shop.html" class="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Shop</a>
            <a href="/collections.html" class="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Collections</a>
            <a href="/custom.html" class="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Custom</a>
            <a href="/contact.html" class="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Contact</a>
          </div>
        </div>
      </header>
    `;
  },

  footer: () => {
    return `
      <footer class="bg-black text-white pt-20 pb-10">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div>
              <a href="/index.html" class="mb-6 flex items-center">
                <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/9d2919b8-9e68-4c70-9a71-6175f2e26831/Gemini_Generated_Image_rmm9rsrmm9rsrmm9-removebg-preview-1767885732389.png?width=8000&height=8000&resize=contain" alt="WALLIFIED" class="h-12 w-auto object-contain transition-all duration-300 hover:scale-105" />
              </a>
              <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
                Premium posters for the modern walls. Build a space that truly reflects your identity with our high-quality prints.
              </p>
            </div>

            <div>
              <h4 class="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
              <ul class="flex flex-col gap-4">
                <li><a href="/shop.html" class="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">Shop All</a></li>
                <li><a href="/collections.html" class="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">Collections</a></li>
                <li><a href="/custom.html" class="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">Custom Posters</a></li>
                <li><a href="/contact.html" class="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-bold uppercase tracking-widest mb-6">Policies</h4>
              <ul class="flex flex-col gap-4">
                <li><a href="/shipping-policy.html" class="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">Shipping Policy</a></li>
                <li><a href="/refund-policy.html" class="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">Refund & Replacement</a></li>
                <li><a href="/privacy-policy.html" class="text-gray-400 hover:text-[#FF0000] transition-colors text-sm">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-bold uppercase tracking-widest mb-6">Contact Info</h4>
              <ul class="flex flex-col gap-4 text-sm text-gray-400">
                <li>Email: support@wallified.com</li>
                <li>WhatsApp: +91 98765 43210</li>
                <li>Hours: Mon - Sat | 10AM - 7PM</li>
              </ul>
            </div>
          </div>

          <div class="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p class="text-gray-500 text-xs">
              © ${new Date().getFullYear()} WALLIFIED. All rights reserved.
            </p>
            <div class="flex gap-6">
              <a href="#" class="text-gray-500 hover:text-white text-xs transition-colors">Instagram</a>
              <a href="#" class="text-gray-500 hover:text-white text-xs transition-colors">Twitter</a>
              <a href="#" class="text-gray-500 hover:text-white text-xs transition-colors">Pinterest</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};

window.renderComponents = () => {
  const headerContainer = document.getElementById('header-container');
  const announcementContainer = document.getElementById('announcement-container');
  const footerContainer = document.getElementById('footer-container');

  if (announcementContainer) announcementContainer.innerHTML = components.announcementStrip();
  if (headerContainer) headerContainer.innerHTML = components.header(window.getCartCount ? window.getCartCount() : 0);
  if (footerContainer) footerContainer.innerHTML = components.footer();

  lucide.createIcons();
};
