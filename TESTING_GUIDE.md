# 🧪 Mart Marketplace - Testing Guide

This guide will help you test all functionality of your Mart marketplace application for your thesis.

## 👥 **Test Accounts Setup**

You'll need to create **3 different Gmail accounts** to test all roles:

1. **Admin Account** - You already have this ✅
2. **Seller Account** - To test selling products
3. **Buyer Account** - To test buying products

---

## 📝 **Step 1: Create Test Accounts**

### **Account 1: Admin (You)**
- ✅ Already created
- Email: `your-email@gmail.com`
- Role: Admin
- Can: Approve products, manage users, view analytics

### **Account 2: Seller**
1. **Register** at http://localhost:3001/register
2. Use a different Gmail: `seller-test@gmail.com`
3. Select **"Seller"** role
4. Fill in details and create account
5. **Login** with seller account

### **Account 3: Buyer**
1. **Register** at http://localhost:3001/register
2. Use another Gmail: `buyer-test@gmail.com`
3. Select **"Buyer"** role
4. Fill in details and create account
5. **Login** with buyer account

**Tip**: You can use Gmail aliases like `yourname+seller@gmail.com` and `yourname+buyer@gmail.com` - they all go to the same inbox!

---

## 🧪 **Testing Checklist**

### **✅ 1. Seller Functionality Testing**

**As Seller Account:**

#### **A. Create Product**
- [ ] Go to "Create Product" or "Sell"
- [ ] Fill in product details:
  - [ ] Title (5-100 characters)
  - [ ] Description (10-1000 characters)
  - [ ] Price (in Euros)
  - [ ] Category (select from dropdown)
  - [ ] Upload at least 1 image (up to 5)
  - [ ] Location: City, State/Region, Country (Finland)
- [ ] Click "Create Product"
- [ ] Should see success message

#### **B. View My Products**
- [ ] Go to "My Products"
- [ ] Your created product should appear
- [ ] Status should be "pending"
- [ ] Check product details are correct

#### **C. Edit Product**
- [ ] Click "Edit" on a product
- [ ] Update title, description, or price
- [ ] Save changes
- [ ] Verify changes saved

#### **D. Delete Product**
- [ ] Click delete button
- [ ] Confirm deletion
- [ ] Product should be removed

---

### **✅ 2. Admin Functionality Testing**

**As Admin Account:**

#### **A. Admin Dashboard**
- [ ] Go to "Admin" in navigation
- [ ] View dashboard statistics:
  - [ ] Total users count
  - [ ] Total products count
  - [ ] Total orders count
  - [ ] Pending products count
  - [ ] Total revenue
- [ ] Check recent users, products, orders

#### **B. Approve Products**
- [ ] Go to "Admin" → "Products"
- [ ] Find products with "pending" status
- [ ] Click "Approve" button
- [ ] Product status changes to "approved"
- [ ] Product should now appear on main products page

#### **C. Reject Products**
- [ ] Find a pending product
- [ ] Click "Reject" button
- [ ] Enter rejection reason
- [ ] Product status changes to "rejected"
- [ ] Product should NOT appear on main products page

#### **D. Manage Users**
- [ ] Go to "Admin" → "Users"
- [ ] View all users (buyers, sellers, admins)
- [ ] Test activate/deactivate user
- [ ] Filter by role (buyer, seller, admin)

#### **E. View Orders**
- [ ] Go to "Admin" → "Orders"
- [ ] View all orders in the system
- [ ] Filter by order status

---

### **✅ 3. Buyer Functionality Testing**

**As Buyer Account:**

#### **A. Browse Products**
- [ ] Go to "Browse" or "Products"
- [ ] View all approved products
- [ ] Check products are displaying correctly:
  - [ ] Images loading
  - [ ] Prices in Euros (€)
  - [ ] Product details visible

#### **B. Search Products**
- [ ] Use search bar in navbar
- [ ] Search for product title
- [ ] Results should filter correctly

#### **C. Filter Products**
- [ ] Use category filter
- [ ] Use price range filter
- [ ] Use sort options (price, date, popularity)
- [ ] Verify filters work correctly

#### **D. View Product Details**
- [ ] Click on any product
- [ ] View full product page:
  - [ ] All images displayed
  - [ ] Description shown
  - [ ] Price in Euros
  - [ ] Seller information
  - [ ] Location information

#### **E. Contact Seller** (Optional)
- [ ] Click "Contact" button
- [ ] Should show seller contact info

#### **F. Checkout Process**
- [ ] Click "Buy Now" on a product
- [ ] Fill in shipping address:
  - [ ] Street address
  - [ ] City (e.g., Helsinki)
  - [ ] State/Region (e.g., Uusimaa)
  - [ ] Postal code (5 digits, e.g., 00100)
  - [ ] Country (Finland)
- [ ] Review order summary
- [ ] Verify price in Euros
- [ ] Click "Pay [amount]"
- [ ] Note: Payment will use Stripe test mode

---

### **✅ 4. Complete Purchase Flow**

**Test Full Transaction:**

1. **As Seller**: Create a product
2. **As Admin**: Approve the product
3. **As Buyer**: 
   - Browse and find the product
   - Click "Buy Now"
   - Complete checkout
   - Process payment (Stripe test mode)
4. **As Seller**: Check "Orders" to see the order
5. **As Admin**: View order in admin panel

---

### **✅ 5. Edge Cases & Error Handling**

Test these scenarios:

- [ ] **Try to buy your own product** (as seller) → Should show error
- [ ] **Try to access admin panel** (as buyer/seller) → Should be denied
- [ ] **Create product without image** → Should show error
- [ ] **Create product with invalid data** → Should show validation errors
- [ ] **Search with no results** → Should show "No products found"
- [ ] **Login with wrong password** → Should show error
- [ ] **Register with non-Gmail** → Should show error

---

## 🎯 **Quick Test Scenario (5 Minutes)**

For a quick test to verify everything works:

1. **Login as Seller** → Create 1 product with image
2. **Login as Admin** → Approve the product
3. **Login as Buyer** → Browse products, view details, start checkout
4. **Verify**: All roles can access their features correctly

---

## 📊 **What to Document for Thesis**

Record these test results:

1. ✅ **User Registration** - All 3 roles working
2. ✅ **Product Creation** - Images upload, validation works
3. ✅ **Admin Approval** - Products can be approved/rejected
4. ✅ **Product Browsing** - Search, filter, pagination working
5. ✅ **Checkout Process** - Payment flow initiated
6. ✅ **Role-Based Access** - Each role sees appropriate features
7. ✅ **Error Handling** - Validation and error messages work

---

## 🐛 **Common Issues & Solutions**

### **Issue: Products not showing after creation**
- **Solution**: Check if product status is "pending" - Admin needs to approve

### **Issue: Can't access admin panel**
- **Solution**: Verify your role is set to "admin" in database

### **Issue: Images not uploading**
- **Solution**: Check Cloudinary credentials in `.env` file

### **Issue: Payment not working**
- **Solution**: Use Stripe test card numbers (see Stripe documentation)

---

## ✅ **Final Checklist**

Before submitting your thesis, verify:

- [ ] All 3 roles (buyer, seller, admin) can register and login
- [ ] Sellers can create products with images
- [ ] Admin can approve/reject products
- [ ] Buyers can browse approved products
- [ ] Search and filters work correctly
- [ ] Checkout process initiates (payment in test mode)
- [ ] All prices show in Euros (€)
- [ ] Location defaults to Finland
- [ ] No console errors
- [ ] Responsive design works on mobile

---

**Good luck with your thesis! 🎓**
