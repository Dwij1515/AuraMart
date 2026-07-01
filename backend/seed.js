const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@auramart.com',
      password: hashedPassword,
      role: 'admin'
    });

    const products = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Immersive sound experience with advanced active noise cancellation.',
        price: 299.99,
        category: 'Electronics',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 24
      },
      {
        name: 'Minimalist Modern Chair',
        description: 'A stylish and comfortable addition to any contemporary living room.',
        price: 150.00,
        category: 'Furniture',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.2,
        numReviews: 12
      },
      {
        name: 'Professional DSLR Camera',
        description: 'Capture stunning moments with high-resolution clarity and speed.',
        price: 1199.99,
        category: 'Electronics',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.9,
        numReviews: 50
      },
      {
        name: 'Classic White Sneakers',
        description: 'Versatile and comfortable, a staple for any casual outfit.',
        price: 85.00,
        category: 'Clothing',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 89
      },
      {
        name: 'Aura Mechanical Gaming Keyboard',
        description: 'Mechanical gaming keyboard with translucent glassmorphic casing and customizable RGB layout.',
        price: 149.99,
        category: 'Electronics',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 18
      },
      {
        name: 'Nebula Smart Water Bottle',
        description: 'Self-cleaning smart bottle with UV-C purification and dynamic LED temperature displays.',
        price: 79.99,
        category: 'Sports',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 15
      },
      {
        name: 'Aura Premium Desk Mat',
        description: 'Extended desk pad featuring clean geometric layouts and water-resistant micro-texture.',
        price: 29.99,
        category: 'Furniture',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 22
      },
      {
        name: 'Ultralight Sports Smartwatch',
        description: 'A sleek smartwatch with high-performance tracking and modern style.',
        price: 199.99,
        category: 'Sports',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 29
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Advanced lumbar support and breathable mesh for maximum comfort.',
        price: 349.99,
        category: 'Furniture',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 34
      },
      {
        name: 'Carbon Fiber Tennis Racket',
        description: 'Professional racket providing exceptional speed, control, and precision.',
        price: 180.00,
        category: 'Sports',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 19
      },
      {
        name: 'Premium Leather Laptop Sleeve',
        description: 'Elegant protection for your laptop, crafted with full-grain leather and soft interior lining.',
        price: 59.99,
        category: 'Clothing',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 42
      },
      {
        name: 'Retro Synthwave Sound Kit',
        description: 'Over 500 premium synth, drum, and sound loops for audio production and composition.',
        price: 49.99,
        category: 'Digital',
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.9,
        numReviews: 88
      },
      {
        name: 'Master MERN Stack E-Book',
        description: 'The ultimate guide to building complete web applications with MongoDB, Express, React, and Node.',
        price: 24.99,
        category: 'Digital',
        stock: 500,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 124
      },
      {
        name: 'HD Portable Bluetooth Speaker',
        description: 'Compact wireless speaker with deep bass, high clarity, and 24-hour battery life.',
        price: 89.99,
        category: 'Electronics',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 53
      },
      {
        name: 'Cyberpunk Desktop Wallpaper Pack',
        description: 'Set of 10 ultra high-resolution wallpapers featuring neon aesthetics and futuristic cities.',
        price: 9.99,
        category: 'Digital',
        stock: 1000,
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 212
      },
      {
        name: 'Pro Resistance Bands Set',
        description: 'Complete stackable resistance band set with handles, ankle straps, and door anchor.',
        price: 34.99,
        category: 'Sports',
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 61
      },
      {
        name: 'Minimalist Aluminum Water Tumbler',
        description: 'Double-walled insulated tumbler for hot and cold beverages on the go.',
        price: 19.99,
        category: 'Clothing',
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 27
      },
      {
        name: 'Glassmorphic Desk Organizer',
        description: 'Sleek, transparent desk organizer tray to keep your writing tools and accessories in order.',
        price: 39.99,
        category: 'Furniture',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 18
      }
    ];

    await Product.insertMany(products);
    
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
