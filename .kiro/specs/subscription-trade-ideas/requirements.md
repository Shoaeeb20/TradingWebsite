# Subscription-Based Paper Trade Ideas - Requirements Document

## Introduction

This document outlines the requirements for a subscription-based paper trade ideas feature for the PaperTrade India application. The system will allow users to subscribe to premium trade suggestions through manual UPI payments, with admin verification and time-limited access to educational trading ideas.

## Glossary

- **Trade Ideas System**: The subscription-based platform for sharing educational trading suggestions
- **Subscription**: A 30-day access period to trade ideas, activated after payment verification
- **Payment Submission**: User-provided payment proof and details for manual verification
- **Admin Panel**: Administrative interface for managing subscriptions and trade ideas
- **UPI Payment**: Manual payment via UPI QR code with screenshot proof
- **Trade Idea**: Educational trading suggestion for paper trading purposes only

## Requirements

### Requirement 1: Manual UPI Payment System

**User Story:** As a user, I want to pay ₹39 per month via UPI and submit payment proof, so that I can access premium trade ideas after verification.

#### Acceptance Criteria

1. WHEN a user accesses the trade ideas page without an active subscription, THE Trade Ideas System SHALL display a payment interface with UPI QR code for oshoaeeb@oksbi (Shoaeeb Osman)
2. WHEN a user completes UPI payment, THE Trade Ideas System SHALL provide a form to submit payment screenshot, registered email, payment app (Google Pay/PhonePe), payment date, and user UPI ID
3. WHEN a user submits payment proof, THE Trade Ideas System SHALL store the submission with pending status and display "Approval takes 24–48 hours" message
4. WHEN a user clicks "I have completed my payment" button, THE Trade Ideas System SHALL save all payment details to the database with timestamp
5. WHERE payment verification is required, THE Trade Ideas System SHALL only accept Google Pay or PhonePe as valid payment methods

### Requirement 2: Admin Verification Workflow

**User Story:** As an admin, I want to manually verify payment submissions via WhatsApp, so that I can approve or reject subscriptions based on actual payment confirmation.

#### Acceptance Criteria

1. WHEN a payment submission is received, THE Admin Panel SHALL display all submission details including screenshot, email, payment app, date, and UPI ID
2. WHEN an admin reviews a payment submission, THE Admin Panel SHALL provide approve/reject options with WhatsApp contact (+91 9330255340) for verification
3. WHEN an admin approves a payment, THE Trade Ideas System SHALL activate a 30-day subscription starting from approval date
4. WHEN an admin rejects a payment, THE Trade Ideas System SHALL maintain the user's inactive status and log the rejection reason
5. WHEN a subscription is activated, THE Trade Ideas System SHALL grant immediate access to the trade ideas page

### Requirement 3: Subscription Management

**User Story:** As a user, I want my subscription to automatically expire after 30 days, so that the system maintains fair access control and encourages renewal.

#### Acceptance Criteria

1. WHEN a subscription is activated, THE Trade Ideas System SHALL set expiration date to 30 days from activation
2. WHEN a subscription expires, THE Trade Ideas System SHALL automatically block access to trade ideas page
3. WHEN an expired user attempts access, THE Trade Ideas System SHALL redirect to payment interface
4. WHEN checking subscription status, THE Trade Ideas System SHALL validate expiration date against current timestamp
5. WHEN a user has an active subscription, THE Trade Ideas System SHALL display remaining days until expiration

### Requirement 4: Trade Ideas Content Management

**User Story:** As an admin, I want to upload and manage trade ideas with automatic cleanup, so that users receive fresh, relevant educational content.

#### Acceptance Criteria

1. WHEN an admin uploads a trade idea, THE Admin Panel SHALL store it with timestamp, category (Equity/F&O), and content details
2. WHEN trade ideas are older than 7 days, THE Trade Ideas System SHALL automatically delete them from the database
3. WHEN displaying trade ideas, THE Trade Ideas System SHALL show all active ideas sorted by newest first
4. WHEN managing content, THE Admin Panel SHALL provide manual delete options for individual trade ideas
5. WHEN uploading ideas, THE Admin Panel SHALL require categorization as either Equity or F&O trades

### Requirement 5: Trade Ideas Access Control

**User Story:** As a subscribed user, I want to access current trade ideas with real-time updates, so that I can use them for educational paper trading purposes.

#### Acceptance Criteria

1. WHEN a user with active subscription accesses trade ideas page, THE Trade Ideas System SHALL display all current trade suggestions
2. WHEN displaying trade ideas, THE Trade Ideas System SHALL auto-refresh content every 5 minutes
3. WHEN a user requests manual refresh, THE Trade Ideas System SHALL immediately fetch and display latest ideas
4. WHEN showing trade ideas, THE Trade Ideas System SHALL categorize them as Equity and F&O sections
5. WHEN accessing the page, THE Trade Ideas System SHALL verify subscription status before displaying content

### Requirement 6: Legal Compliance and Disclaimers

**User Story:** As a platform operator, I want to display clear legal disclaimers, so that users understand this is for educational paper trading only and not investment advice.

#### Acceptance Criteria

1. WHEN displaying trade ideas, THE Trade Ideas System SHALL prominently show disclaimer: "This platform is not SEBI registered. All trade ideas are strictly for paper trading and educational purposes only. No real-money trading or investment advice is provided."
2. WHEN users access any trade ideas content, THE Trade Ideas System SHALL ensure disclaimer visibility on every page
3. WHEN storing trade ideas, THE Trade Ideas System SHALL tag all content as educational/paper trading only
4. WHEN displaying payment interface, THE Trade Ideas System SHALL clarify that payment is for educational content access
5. WHEN users interact with the system, THE Trade Ideas System SHALL maintain clear separation from real trading functionality

### Requirement 7: Data Security and Privacy

**User Story:** As a user, I want my payment information and personal data to be securely stored, so that my privacy is protected throughout the subscription process.

#### Acceptance Criteria

1. WHEN storing payment screenshots, THE Trade Ideas System SHALL securely store files with encrypted file names
2. WHEN handling user data, THE Trade Ideas System SHALL encrypt sensitive information like UPI IDs and email addresses
3. WHEN processing payment submissions, THE Trade Ideas System SHALL validate and sanitize all input data
4. WHEN displaying admin panel, THE Trade Ideas System SHALL require secure authentication for admin access
5. WHEN managing user data, THE Trade Ideas System SHALL comply with data retention policies and allow data deletion upon request

### Requirement 8: User Experience and Interface

**User Story:** As a user, I want an intuitive interface for payment submission and trade ideas access, so that I can easily navigate the subscription process and consume content.

#### Acceptance Criteria

1. WHEN displaying payment interface, THE Trade Ideas System SHALL provide clear step-by-step instructions for UPI payment
2. WHEN showing trade ideas, THE Trade Ideas System SHALL use responsive design for mobile and desktop access
3. WHEN users submit payment proof, THE Trade Ideas System SHALL provide immediate confirmation and next steps
4. WHEN displaying subscription status, THE Trade Ideas System SHALL show clear indicators for active/expired/pending states
5. WHEN users navigate the system, THE Trade Ideas System SHALL provide consistent branding and user experience with the main paper trading app