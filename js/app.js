
// Supabase Configuration
const SUPABASE_URL = 'https://oyrxevacnxayhjoievgu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cnhldmFjbnhheWhqb2lldmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2ODEzODYsImV4cCI6MjA4MzI1NzM4Nn0.hu7FYYlYpJsGwtMfftzQDVWIk7O2o5q_OHXuPnpu5Ww';

let supabaseClient;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Real API Functions using Supabase
window.api = {
  getProducts: async () => {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient.from('products').select('*');
    if (error) { console.error('Error fetching products:', error); return []; }
    return data;
  },

  getBestSellers: async () => {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .limit(8);
    if (error) { console.error('Error fetching best sellers:', error); return []; }
    return data;
  },

  getTrending: async () => {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .limit(8);
    if (error) { console.error('Error fetching trending:', error); return []; }
    return data;
  },

  getCollections: async () => {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('collections')
      .select('*')
      .limit(4);
    if (error) { console.error('Error fetching collections:', error); return []; }
    return data;
  },

  getProductById: async (id) => {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.error('Error fetching product:', error); return null; }
    return data;
  },

  getProductsByCategory: async (category) => {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .ilike('category', `%${category}%`);
    if (error) { console.error('Error fetching category products:', error); return []; }
    return data;
  },

  getReviews: async () => {
    return [
      { name: "Rahul S.", rating: 5, text: "Quality is insane! The colors are so vibrant and the paper is thick." },
      { name: "Ananya P.", rating: 5, text: "Ordered the Anime Trio, looks amazing on my wall. Fast delivery too." },
      { name: "Vikram M.", rating: 4, text: "Packaging was solid. No bends at all. Highly recommend Wallified." }
    ];
  },

  getRealReviews: async () => {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('Error fetching reviews:', error); return []; }
    return data;
  },

  addReview: async (reviewData) => {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    if (error) { console.error('Error adding review:', error); throw error; }
    return data;
  },

  uploadReviewMedia: async (file) => {
    if (!supabaseClient) return null;
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabaseClient.storage
      .from('review-media')
      .upload(fileName, file);
    
    if (error) { console.error('Error uploading media:', error); return null; }
    
    const { data: { publicUrl } } = supabaseClient.storage
      .from('review-media')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  getFaqs: async () => {
    return [
      { question: "What is the quality of the posters?", answer: "All our posters are printed on high-quality 300GSM art board with a matte finish for a premium look and feel." },
      { question: "Do you offer free shipping?", answer: "Yes! We offer free shipping on all prepaid orders across India. For COD orders, a small shipping fee is applicable." },
      { question: "What if I receive a damaged product?", answer: "We have a solid replacement policy. If your poster arrives damaged, just send us a photo on WhatsApp and we'll send a replacement immediately." },
      { question: "Can I get a custom design printed?", answer: "Absolutely! Head over to our Custom Posters page or contact us on WhatsApp with your design requirements." }
    ];
  },

  uploadCustomPoster: async (file, details) => {
    if (!supabaseClient) return null;
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabaseClient.storage
      .from('custom-posters')
      .upload(fileName, file);
    
    if (error) { console.error('Error uploading:', error); return null; }
    
    const { data: { publicUrl } } = supabaseClient.storage
      .from('custom-posters')
      .getPublicUrl(fileName);

    const { data: request, error: dbError } = await supabaseClient
      .from('custom_requests')
      .insert({
        image_url: publicUrl,
        details: details,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) { console.error('Error saving request:', dbError); return null; }
    return request;
  }
};

// Cart Management
const getCart = () => JSON.parse(localStorage.getItem('wallified-cart') || '[]');
const saveCart = (cart) => {
  localStorage.setItem('wallified-cart', JSON.stringify(cart));
  if (window.renderComponents) window.renderComponents();
};

window.getCartCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

window.addToCart = (product, size, material, price) => {
  let cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === size && item.material === material);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image_url,
      size: size,
      material: material,
      price: price,
      quantity: 1
    });
  }
  saveCart(cart);
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

window.removeFromCart = (index) => {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
};

window.updateQuantity = (index, delta) => {
  let cart = getCart();
  cart[index].quantity = Math.max(1, cart[index].quantity + delta);
  saveCart(cart);
};

// Global Init
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (window.renderComponents) window.renderComponents();
});
