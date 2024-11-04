import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Maximize2, Minimize2, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUsers from '../context/User.jsx';
import useFetch from './../hooks/User.jsx';

const Bot = () => {

    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Hi! I\'m here to help you with DevDiscuss. What would you like to know?',
        }
    ]);
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);

    const { user, changeLogin, changeModel } = useUsers()

    const { cur_user } = useFetch(user.id);

    const initTour = (tour) => {
        setTimeout(() => {
            // Initialize new tour
            if (tour === 'post') {
                const driverObj = driver({
                    showProgress: true,
                    steps: [
                        {
                            element: '#write-button',
                            popover: {
                                title: 'Create a Post',
                                description: 'Click here to start writing a new post',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    navigate('/write')
                                    driverObj.moveTo(1)
                                },

                            }
                        },
                        {
                            element: '#post-form',
                            popover: {
                                title: 'Write Post',
                                description: 'Fill in your post details here',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    driverObj.moveNext()
                                },
                            }
                        },
                        {
                            element: '#post-button',
                            popover: {
                                title: 'Post Form',
                                description: 'Then click on Post to Publish',
                                side: "left",
                                align: 'start',

                            }
                        }
                    ],
                });
                driverObj.drive()
            } else if (tour === 'login') {
                const driverObj = driver({
                    showProgress: true,
                    steps: [
                        {
                            element: '#login-button',
                            popover: {
                                title: 'SignIn Button',
                                description: 'Click here to access login options',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    changeLogin(true)
                                    driverObj.moveNext()
                                }
                            }
                        },
                        {
                            element: '#login-form',
                            popover: {
                                title: 'Login Form',
                                description: 'Fill form if your already registers',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    driverObj.moveNext()
                                }
                            }
                        },
                        {
                            element: '#register',
                            popover: {
                                title: 'To Sign Up',
                                description: 'Click here CREATE NEW ACCOUNT',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    driverObj.moveNext()
                                }
                            }
                        }
                    ]
                });
                driverObj.drive()
            } else if (tour === 'profile') {
                const driverObj = driver({
                    showProgress: true,
                    steps: [
                        {
                            element: '#profile',
                            popover: {
                                title: 'Profile',
                                description: 'Click on this profile',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    changeModel(true)
                                    driverObj.moveNext()
                                }
                            }
                        },
                        {
                            element: '#profile-tab',
                            popover: {
                                title: 'Profile',
                                description: 'Click on Your name',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    navigate(`/user/${cur_user?.username}`)
                                    driverObj.moveNext()
                                }
                            }
                        },
                        {
                            element: '#profile-pic',
                            popover: {
                                title: 'Profile Pics',
                                description: 'Click on profile pics to update',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    driverObj.moveNext()
                                }
                            }
                        },
                        {
                            element: '#profile-name',
                            popover: {
                                title: 'Profile',
                                description: 'Click on Edit to change name',
                                side: "left",
                                align: 'start'
                            }
                        },
                    ]
                });
                driverObj.drive()
            } else if (tour === 'bookmark') {
                const driverObj = driver({
                    showProgress: true,
                    steps: [
                        {
                            element: '#profile',
                            popover: {
                                title: 'Profile',
                                description: 'Click on this profile',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    changeModel(true)
                                    driverObj.moveNext()
                                }
                            }
                        },
                        {
                            element: '#bookmark',
                            popover: {
                                title: 'Profile',
                                description: 'Click on saved posts to check saved posts',
                                side: "left",
                                align: 'start',
                                onNextClick: () => {
                                    navigate(`/user/${cur_user?.username}#bookmarks`)
                                    driverObj.moveNext()
                                }
                            }
                        },
                        {
                            element: '#bookmarked-posts',
                            popover: {
                                title: 'Saved Posts',
                                description: "You'll find bookmarked posts here",
                                side: "left",
                                align: 'start'
                            }
                        },
                    ]
                });
                driverObj.drive()
            }
        }, 2000);

    };

    const getBotResponse = async (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';

        const isLoggedIn = !!user.id;
        const greetingKeywords = ['hello', 'hi', 'hey', 'greetings', 'what\'s up', 'good morning', 'good evening', 'good afternoon'];
        const loginKeywords = ['login', 'sign in', 'signin'];
        const profileKeywords = ['profile', 'avatar', 'name', 'bio', 'account'];
        const postKeywords = ['post', 'blog', 'article'];
        const createKeywords = ['how', 'create', 'write', 'start'];
        const commentKeywords = ['leave', 'comment', 'feedback', 'respond', 'opinion'];
        const bookmarkKeywords = ['bookmark', 'save', 'saved post', 'saved posts', 'favorite'];
        const readKeywords = ['read', 'view', 'browse', 'explore', 'posts', 'blogs'];
        const aboutKeywords = ['about', 'what is', 'site', 'devdiscuss', 'features', 'info'];

        // Check for Greeting
        if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
            response = "Hello there! 😊 How can I assist you on DevDiscuss today? Feel free to ask about posting, logging in, profile settings, or anything else you need!";
        }
        // Check for Login Tour
        else if (loginKeywords.some(keyword => lowerMessage.includes(keyword))) {
            if (isLoggedIn) {
                response = "You're already logged in! To switch accounts, simply log out and log in with another account.";
            } else {
                response = "You can log in via:\n1. Email and password\n2. Google\n3. GitHub\nJust click the 'Sign In' button in the top right corner to get started. I’ll show you exactly where to go!";
                initTour('login');
            }
        }

        // Check for Profile Tour
        else if (profileKeywords.some(keyword => lowerMessage.includes(keyword))) {
            if (isLoggedIn) {
                response = "Here’s how to update your profile:\n1. Click on your avatar in the top right\n2. Choose 'Profile Settings'\n3. Update any info you'd like\n4. Click 'Save Changes'\n\nReady to go? I'll guide you through it!";
                initTour('profile');
            } else {
                response = "To access and update your profile, please log in first. Once you're logged in, I’ll guide you through the process.";
            }
        }

        // Check for Comment on Post
        else if (postKeywords.some(keyword => lowerMessage.includes(keyword)) && commentKeywords.some(keyword => lowerMessage.includes(keyword))) {
            response = isLoggedIn
                ? "To comment, click the 📝 button at the top right of the post, next to the ❤️ button. Let me know if you need help finding it!"
                : "To leave a comment, please log in first. After that, you'll see the 📝 button at the top right of the post, right next to the ❤️ button.";
        }

        // Check for Create Post Tour
        else if (postKeywords.some(keyword => lowerMessage.includes(keyword)) && createKeywords.some(keyword => lowerMessage.includes(keyword))) {
            if (isLoggedIn) {
                response = "Here’s how to create a post:\n1. Click the 'Write📝' button in the top right\n2. Add a title and content\n3. Add relevant tags\n4. Click 'Publish' when you're ready\n\nI’ll show you the way!";
                initTour('post');
            } else {
                response = "To create a post, you’ll need to log in first. Once you’re logged in, I can guide you through it step-by-step.";
            }
        }

        // Check for Bookmark Tour
        else if (bookmarkKeywords.some(keyword => lowerMessage.includes(keyword))) {
            if (isLoggedIn) {
                response = "To bookmark a post:\n1. Click the 'Bookmark' icon below the post title\n2. The post will be saved in your bookmarks\n\nTo view saved posts:\n1. Click your avatar\n2. Choose 'Saved Posts' from the menu\n\nI can show you where to find these features!";
                initTour('bookmark');
            } else {
                response = "Bookmarking requires you to log in first. Once logged in, you can save posts to your profile for easy access later!";
            }
        }

        // Check for Read Posts
        else if (readKeywords.some(keyword => lowerMessage.includes(keyword))) {
            response = "To browse posts on DevDiscuss, simply scroll through the homepage or use the search bar to explore specific topics. Click on a title to dive into the full content.";
        }

        // Check for About Site and Features
        else if (aboutKeywords.some(keyword => lowerMessage.includes(keyword))) {
            response = "DevDiscuss is a platform for developers to share insights, learn from one another, and keep up with tech trends through blog posts.\n\nKey features include:\n1. 📝 Writing and Posting Blogs: Share your thoughts.\n2. 🌗 Light/Dark Mode: Switch between themes.\n3. 💾 Bookmarking Posts: Save posts to revisit.\n4. 👤 Profile Management: Update your profile, see your blogs, and more.\n\nWhether you're just starting out or are experienced, you’ll find value and community here on DevDiscuss!";
        }

        // Default Response
        else {
            response = "I'm here to assist you specifically with DevDiscuss features. Could you tell me more about what you're trying to do on the site? I can help with creating posts, logging in, editing your profile, bookmarking, and reading posts.";
        }

        return response;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Add user message
        const userMessage = {
            type: 'user',
            content: input.trim(),
        };

        // Add loading message
        setMessages(prev => [...prev, userMessage, { type: 'loading' }]);
        setInput('');

        setTimeout(async () => {

            // Get bot response
            const response = await getBotResponse(input);

            // Remove loading message and add bot response
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.type !== 'loading');
                return [...filtered, { type: 'bot', content: response }];
            });
        }, 1000);

    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors">
                    Need help?
                </button>
            ) : (
                <div className={`bg-white rounded-lg shadow-xl w-96 ${isMinimized ? 'h-12' : 'h-[550px]'} flex flex-col`}>
                    {/* Chat Header */}
                    <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-medium">DevDiscuss Assistant</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="hover:bg-blue-700 p-1 rounded"
                            >
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-blue-700 p-1 rounded">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {message.type === 'loading' ? (
                                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-3">
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        ) : (
                                            <div className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <p className="whitespace-pre-line font-normal">
                                                    {message.content}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSubmit} className="p-4 border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        autoFocus
                                        placeholder="Type your question..."
                                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Bot;