const User = require('../models/User');
const Client = require('../models/Client');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get current user's profile (User + Client data merged)
exports.getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Get user with populated role
  const user = await User.findById(userId).populate('role');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  let profileData = {
    // User data
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      userType: user.userType,
      role: user.role,
      status: user.status,
    },
  };

  // If user is a client, fetch and merge client data
  if (user.userType === 'client' && user.clientId) {
    const client = await Client.findById(user.clientId);

    if (client) {
      profileData.client = {
        _id: client._id,
        companyName: client.companyName,
        contactPerson: client.contactPerson,
        email: client.email,
        phone: client.phone,
        website: client.website,
        taxId: client.taxId,
        industry: client.industry,
        address: client.address,
        billingAddress: client.billingAddress,
        paymentTerms: client.paymentTerms,
        creditLimit: client.creditLimit,
        preferredCurrency: client.preferredCurrency,
        notes: client.notes,
        tags: client.tags,
        source: client.source,
      };
    }
  }

  new ApiResponse(200, profileData, 'Profile retrieved successfully').send(res);
});

// Update current user's profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Get current user
  const user = await User.findById(userId).populate('role');

  if (!user) {
    return next(new ApiError('User not found', 404));
  }

  const {
    // User fields
    firstName,
    lastName,
    phone,
    dateOfBirth,
    nationality,
    preferredLanguage,

    // Client fields
    companyName,
    jobTitle,
    companyEmail,
    companyPhone,
    industry,
    website,
    taxId,
    billingAddress,
    shippingAddress,
    paymentMethod,
    creditLimit,
    specialInstructions,
    sameAsBilling,
  } = req.body;

  // Update User fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;

  await user.save();

  // If user is a client, update Client data
  if (user.userType === 'client' && user.clientId) {
    const client = await Client.findById(user.clientId);

    if (!client) {
      return next(new ApiError('Client profile not found', 404));
    }

    // Update Client fields
    if (companyName) client.companyName = companyName;
    if (industry) client.industry = industry;
    if (website) client.website = website;
    if (taxId) client.taxId = taxId;

    // Update contact person
    if (firstName || lastName || companyEmail || companyPhone) {
      client.contactPerson = client.contactPerson || {};
      if (firstName) client.contactPerson.firstName = firstName;
      if (lastName) client.contactPerson.lastName = lastName;
      if (companyEmail) client.contactPerson.email = companyEmail;
      if (companyPhone) client.contactPerson.phone = companyPhone;
      if (jobTitle) client.contactPerson.jobTitle = jobTitle;
    }

    // Update billing address
    if (billingAddress) {
      client.address = {
        street: billingAddress.street || client.address?.street || '',
        city: billingAddress.city || client.address?.city || '',
        state: billingAddress.state || client.address?.state || '',
        postalCode: billingAddress.postalCode || client.address?.postalCode || '',
        country: billingAddress.country || client.address?.country || '',
      };
    }

    // Update billing address separately if needed
    if (billingAddress) {
      client.billingAddress = {
        street: billingAddress.street || client.billingAddress?.street || '',
        city: billingAddress.city || client.billingAddress?.city || '',
        state: billingAddress.state || client.billingAddress?.state || '',
        postalCode: billingAddress.postalCode || client.billingAddress?.postalCode || '',
        country: billingAddress.country || client.billingAddress?.country || '',
        sameAsAddress: sameAsBilling !== undefined ? sameAsBilling : true,
      };
    }

    // Update shipping address if provided and different from billing
    if (shippingAddress && !sameAsBilling) {
      client.billingAddress = client.billingAddress || {};
      client.billingAddress.sameAsAddress = false;
      // You might want to add a separate shippingAddress field to the Client model
    }

    // Update payment/credit information
    if (creditLimit !== undefined) client.creditLimit = creditLimit;
    if (specialInstructions) client.notes = specialInstructions;

    await client.save();
  }

  // Fetch updated profile
  const updatedUser = await User.findById(userId).populate('role');
  let profileData = {
    user: {
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      userType: updatedUser.userType,
      role: updatedUser.role,
    },
  };

  if (updatedUser.userType === 'client' && updatedUser.clientId) {
    const updatedClient = await Client.findById(updatedUser.clientId);
    if (updatedClient) {
      profileData.client = {
        _id: updatedClient._id,
        companyName: updatedClient.companyName,
        contactPerson: updatedClient.contactPerson,
        email: updatedClient.email,
        phone: updatedClient.phone,
        website: updatedClient.website,
        taxId: updatedClient.taxId,
        industry: updatedClient.industry,
        address: updatedClient.address,
        billingAddress: updatedClient.billingAddress,
        paymentTerms: updatedClient.paymentTerms,
        creditLimit: updatedClient.creditLimit,
        notes: updatedClient.notes,
      };
    }
  }

  new ApiResponse(200, profileData, 'Profile updated successfully').send(res);
});
