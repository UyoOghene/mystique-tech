// In your authRoutes.js - Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register endpoint hit');
    console.log('Request body:', req.body);

    const { firstName, lastName, email, password, name } = req.body;

    // Handle both name formats (frontend sends firstName/lastName, backend expects name)
    const fullName = name || `${firstName} ${lastName}`.trim();

    // Detailed validation
    if ((!firstName || !lastName) && !name) {
      console.log('❌ Missing name fields:', { firstName, lastName, name });
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    console.log('🔍 Checking if user exists...');
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    console.log('👤 Creating new user...');
    const user = await User.create({
      name: fullName,
      email: email.toLowerCase().trim(),
      password
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    };

    console.log('✅ User created successfully:', userResponse.email);

    res.status(201).json({
      success: true,
      ...userResponse
    });

  } catch (error) {
    console.error('💥 Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'production' ? {} : error.message
    });
  }
});