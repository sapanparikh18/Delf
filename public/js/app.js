/* ============================================================
   Le Petit Français — Main App
   PWA with Firestore integration
   Les Bonbons color scheme
   ============================================================ */

// --- Firebase Config ---
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAj_o7yP-WuqeGgjhThNue8Sy0AAlXqlFo",
  authDomain: "delf-7b02e.firebaseapp.com",
  projectId: "delf-7b02e",
  storageBucket: "delf-7b02e.firebasestorage.app",
  messagingSenderId: "555801520784",
  appId: "1:555801520784:web:09c2c4a48ebf4e03a9c615",
  measurementId: "G-83RK8VK8KY"
};

// Initialize Firebase (graceful fallback if not configured)
let db = null;
let auth = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
} catch (e) {
  console.log('Firebase not configured — running in local-only mode');
}

// ============================================================
// AUTH MODULE — Google Sign-In
// ============================================================
const Auth = {
  currentUser: null,

  init() {
    if (!auth) return;

    auth.onAuthStateChanged(async (user) => {
      Auth.currentUser = user;
      if (user) {
        console.log('Signed in as:', user.displayName);
        await Auth.loadFromFirestore(user);
        Auth.updateUI(user);

        // If not onboarded yet, pre-fill name from Google
        if (!App.state.onboarded) {
          const nameInput = document.getElementById('player-name');
          if (nameInput && user.displayName) {
            nameInput.value = user.displayName.split(' ')[0];
            App.checkOnboardingReady();
          }
          App.startOnboarding();
        } else {
          App.updateHomeScreen();
        }
      }
    });
  },

  async signInWithGoogle() {
    if (!auth) {
      // No Firebase — just proceed to onboarding
      App.startOnboarding();
      return;
    }

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      await auth.signInWithPopup(provider);
      // onAuthStateChanged handles the rest
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') return;
      if (error.code === 'auth/popup-blocked') {
        // Fallback to redirect
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithRedirect(provider);
        return;
      }
      console.error('Sign-in error:', error);
      // Fallback: proceed without auth
      App.startOnboarding();
    }
  },

  async loadFromFirestore(user) {
    if (!db || !user) return;

    try {
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists) {
        const cloudState = doc.data();
        // Merge: take the one with more progress
        if (cloudState.lessonsCompleted > (App.state.lessonsCompleted || 0)) {
          App.state = { ...App.state, ...cloudState };
          App.saveStateLocal();
        }
      }
    } catch (e) {
      console.log('Could not load from Firestore:', e.message);
    }
  },

  async signOut() {
    if (!auth) return;
    try {
      await auth.signOut();
      Auth.currentUser = null;
      Auth.updateUI(null);
    } catch (e) {
      console.error('Sign-out error:', e);
    }
  },

  updateUI(user) {
    // Update profile screen avatar
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) {
      if (user && user.photoURL) {
        avatarEl.innerHTML = `<img src="${user.photoURL}" alt="avatar" class="profile-avatar-img" referrerpolicy="no-referrer">`;
      } else {
        avatarEl.textContent = '🦊';
      }
    }

    // Update profile auth section
    const authEl = document.getElementById('profile-auth');
    if (authEl) {
      if (user) {
        authEl.innerHTML = `
          <div class="profile-auth-email">${user.email || ''}</div>
          <button class="btn-signout" onclick="Auth.signOut()">Sign out</button>
          <div class="auth-synced">☁️ Progress synced</div>
        `;
      } else {
        authEl.innerHTML = `
          <button class="btn-signout" onclick="Auth.signInWithGoogle()">Sign in to sync</button>
        `;
      }
    }
  }
};

// ============================================================
// LESSON CONTENT — Chapter 1: Rémi arrives in Paris
// ============================================================
const CHAPTER_DATA = {
  id: 1,
  title: "Rémi arrives in Paris",
  worlds: {
    listening: {
      name: "Listening Lane",
      desc: "Sounds of Paris",
      icon: "🎧",
      color: "#099197",
      lessons: [
        {
          id: "l1-listen-1",
          title: "Bonjour et Au revoir",
          subtitle: "Greetings you'll hear everywhere",
          activities: [
            {
              type: "multiple-choice",
              prompt: "Listen! What does 'Bonjour' mean?",
              promptLabel: "Rémi says: Bonjour !",
              options: ["Hello / Good day", "Goodbye", "Thank you", "Please"],
              correct: 0
            },
            {
              type: "multiple-choice",
              prompt: "What does 'Au revoir' mean?",
              promptLabel: "Rémi says: Au revoir !",
              options: ["Good morning", "See you later", "Goodbye", "Good night"],
              correct: 2
            },
            {
              type: "multiple-choice",
              prompt: "It's nighttime. Rémi says...",
              promptLabel: "🌙 It's 9 PM in Paris",
              options: ["Bonjour !", "Bonsoir !", "Merci !", "Salut !"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Salut' is a casual way to say...",
              promptLabel: "Rémi meets his friend",
              options: ["Thank you", "Sorry", "Hi / Bye", "Please"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match the French with English!",
              pairs: [
                { french: "Bonjour", english: "Hello" },
                { french: "Au revoir", english: "Goodbye" },
                { french: "Bonsoir", english: "Good evening" },
                { french: "Salut", english: "Hi" }
              ]
            }
          ]
        },
        {
          id: "l1-listen-2",
          title: "Comment tu t'appelles ?",
          subtitle: "Introducing yourself",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Je m'appelle Rémi' means...",
              promptLabel: "Rémi introduces himself",
              options: ["I am happy", "My name is Rémi", "I like Rémi", "I live in Paris"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "How do you ask 'What is your name?'",
              promptLabel: "Rémi meets a new friend",
              options: ["Où habites-tu ?", "Comment tu t'appelles ?", "Quel âge as-tu ?", "Comment ça va ?"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Enchanté' means...",
              promptLabel: "After introductions",
              options: ["Thank you", "Nice to meet you", "See you soon", "You're welcome"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Comment ça va ?' asks about...",
              promptLabel: "Rémi checks on his friend",
              options: ["Your name", "Your age", "How you're doing", "Where you live"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match the question with the answer!",
              pairs: [
                { french: "Comment tu t'appelles ?", english: "Je m'appelle..." },
                { french: "Comment ça va ?", english: "Ça va bien !" },
                { french: "Quel âge as-tu ?", english: "J'ai 10 ans" },
                { french: "Où habites-tu ?", english: "J'habite à Paris" }
              ]
            }
          ]
        },
        {
          id: "l1-listen-3",
          title: "Les nombres 1–10",
          subtitle: "Counting in French",
          activities: [
            {
              type: "multiple-choice",
              prompt: "What number is 'trois' ?",
              promptLabel: "Rémi is counting croissants",
              options: ["2", "3", "4", "5"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Sept' is the number...",
              promptLabel: "Counting steps on the Eiffel Tower",
              options: ["6", "7", "8", "9"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "How do you say '5' in French?",
              promptLabel: "🖐️ Five fingers!",
              options: ["Quatre", "Cinq", "Six", "Huit"],
              correct: 1
            },
            {
              type: "matching",
              prompt: "Match numbers with French words!",
              pairs: [
                { french: "Un", english: "1" },
                { french: "Quatre", english: "4" },
                { french: "Six", english: "6" },
                { french: "Dix", english: "10" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "Put in order: un, ___, trois",
              promptLabel: "What comes between?",
              options: ["Quatre", "Cinq", "Deux", "Sept"],
              correct: 2
            }
          ]
        },
        {
          id: "l1-listen-4",
          title: "Les nombres 11–20",
          subtitle: "Bigger numbers!",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Quinze' is the number...",
              promptLabel: "Rémi's bus number",
              options: ["13", "14", "15", "16"],
              correct: 2
            },
            {
              type: "multiple-choice",
              prompt: "How do you say '20' in French?",
              promptLabel: "🎂 20 candles!",
              options: ["Dix-huit", "Dix-neuf", "Vingt", "Trente"],
              correct: 2
            },
            {
              type: "multiple-choice",
              prompt: "'Douze' means...",
              promptLabel: "A dozen eggs in Paris",
              options: ["10", "11", "12", "13"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match the numbers!",
              pairs: [
                { french: "Onze", english: "11" },
                { french: "Treize", english: "13" },
                { french: "Seize", english: "16" },
                { french: "Dix-huit", english: "18" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "What comes after 'dix-sept' ?",
              promptLabel: "Counting up...",
              options: ["Dix-six", "Dix-huit", "Dix-neuf", "Quinze"],
              correct: 1
            }
          ]
        }
      ]
    },
    reading: {
      name: "Reading Garden",
      desc: "Signs, menus & postcards",
      icon: "📖",
      color: "#FCB315",
      lessons: [
        {
          id: "l1-read-1",
          title: "Signs in the city",
          subtitle: "Reading everyday French",
          activities: [
            {
              type: "multiple-choice",
              prompt: "You see 'SORTIE' on a door. It means...",
              promptLabel: "🚪 At the metro station",
              options: ["Entrance", "Exit", "Closed", "Push"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'ENTRÉE' on the sign means...",
              promptLabel: "🏛️ At the museum",
              options: ["Exit", "Entrance", "Tickets", "Closed"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'FERMÉ' on the shop door means...",
              promptLabel: "🏪 The bakery at night",
              options: ["Open", "Sale!", "Closed", "Welcome"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match the signs!",
              pairs: [
                { french: "Ouvert", english: "Open" },
                { french: "Fermé", english: "Closed" },
                { french: "Entrée", english: "Entrance" },
                { french: "Sortie", english: "Exit" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "You see 'TIREZ' on a door handle. You should...",
              promptLabel: "🚪 At the café",
              options: ["Push", "Pull", "Knock", "Wait"],
              correct: 1
            }
          ]
        },
        {
          id: "l1-read-2",
          title: "At the café",
          subtitle: "Reading a French menu",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Un croissant' on the menu is...",
              promptLabel: "🥐 Rémi's breakfast",
              options: ["A sandwich", "A pastry", "A drink", "A salad"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Un jus d'orange' is...",
              promptLabel: "🍊 Rémi is thirsty",
              options: ["Apple juice", "Orange juice", "Milk", "Water"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'L'addition, s'il vous plaît' means...",
              promptLabel: "Rémi finished eating",
              options: ["More bread please", "The menu please", "The bill please", "A table please"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match café words!",
              pairs: [
                { french: "Café", english: "Coffee" },
                { french: "Thé", english: "Tea" },
                { french: "Eau", english: "Water" },
                { french: "Lait", english: "Milk" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "'S'il vous plaît' means...",
              promptLabel: "Being polite!",
              options: ["Thank you", "Please", "Excuse me", "Sorry"],
              correct: 1
            }
          ]
        },
        {
          id: "l1-read-3",
          title: "Rémi's postcard",
          subtitle: "Reading a letter from Rémi",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Cher ami' at the start of a letter means...",
              promptLabel: "📮 Rémi writes home",
              options: ["Dear friend", "Hello sir", "Goodbye", "With love"],
              correct: 0
            },
            {
              type: "multiple-choice",
              prompt: "'J'habite à Paris' means...",
              promptLabel: "Rémi tells his story",
              options: ["I love Paris", "I live in Paris", "I visit Paris", "I left Paris"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Bisous' at the end of a letter means...",
              promptLabel: "💌 Signing off",
              options: ["Sincerely", "Best wishes", "Kisses", "See you"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match letter phrases!",
              pairs: [
                { french: "Cher", english: "Dear" },
                { french: "Bisous", english: "Kisses" },
                { french: "À bientôt", english: "See you soon" },
                { french: "Amitié", english: "Friendship" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "'Je suis content' means...",
              promptLabel: "Rémi is having fun!",
              options: ["I am tired", "I am happy", "I am lost", "I am hungry"],
              correct: 1
            }
          ]
        },
        {
          id: "l1-read-4",
          title: "Colors everywhere",
          subtitle: "Les couleurs de Paris",
          activities: [
            {
              type: "multiple-choice",
              prompt: "The French flag is 'bleu, blanc, rouge'. 'Blanc' means...",
              promptLabel: "🇫🇷 Vive la France !",
              options: ["Blue", "White", "Red", "Green"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Jaune' is the color of...",
              promptLabel: "🌻 Sunflowers in Provence",
              options: ["Red", "Blue", "Green", "Yellow"],
              correct: 3
            },
            {
              type: "matching",
              prompt: "Match the colors!",
              pairs: [
                { french: "Rouge", english: "Red" },
                { french: "Bleu", english: "Blue" },
                { french: "Vert", english: "Green" },
                { french: "Noir", english: "Black" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "'Rose' in French means the color...",
              promptLabel: "🌸 Cherry blossoms",
              options: ["Red", "Orange", "Pink", "Purple"],
              correct: 2
            },
            {
              type: "multiple-choice",
              prompt: "What color is 'marron' ?",
              promptLabel: "🌰 Like a chestnut!",
              options: ["Orange", "Brown", "Maroon", "Red"],
              correct: 1
            }
          ]
        }
      ]
    },
    writing: {
      name: "Writing Workshop",
      desc: "Postcards, forms & notes",
      icon: "✏️",
      color: "#A36AA5",
      lessons: [
        {
          id: "l1-write-1",
          title: "Your first French words",
          subtitle: "Write like Rémi!",
          activities: [
            {
              type: "multiple-choice",
              prompt: "How do you write 'Hello' in French?",
              promptLabel: "✏️ Write it out!",
              options: ["Bonjor", "Bonjour", "Bonsour", "Bonjoure"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "How do you spell 'Thank you' in French?",
              promptLabel: "✏️ Rémi says thanks",
              options: ["Mersi", "Mersci", "Merci", "Mercy"],
              correct: 2
            },
            {
              type: "multiple-choice",
              prompt: "'Je m'appelle ___' — Pick the correct spelling",
              promptLabel: "Fill in your name!",
              options: ["Je m'apple", "Je m'appelle", "Je mapelle", "Je mappelle"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "How do you spell 'yes' in French?",
              promptLabel: "👍",
              options: ["Oui", "Ouie", "Wi", "Wee"],
              correct: 0
            },
            {
              type: "matching",
              prompt: "Match spelling pairs!",
              pairs: [
                { french: "S'il vous plaît", english: "Please" },
                { french: "Merci", english: "Thank you" },
                { french: "De rien", english: "You're welcome" },
                { french: "Excusez-moi", english: "Excuse me" }
              ]
            }
          ]
        },
        {
          id: "l1-write-2",
          title: "Fill the form",
          subtitle: "French forms & info",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Nom' on a form means...",
              promptLabel: "📋 Registration form",
              options: ["Age", "Name", "Address", "Phone"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Prénom' means...",
              promptLabel: "📋 What to write here?",
              options: ["Last name", "First name", "Nickname", "Title"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Adresse' on the form is for your...",
              promptLabel: "📋 Line 3",
              options: ["Age", "Phone number", "Address", "Email"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match form words!",
              pairs: [
                { french: "Nom", english: "Last name" },
                { french: "Prénom", english: "First name" },
                { french: "Âge", english: "Age" },
                { french: "Adresse", english: "Address" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "'Date de naissance' means...",
              promptLabel: "📋 When were you born?",
              options: ["Place of birth", "Date of birth", "Full name", "Nationality"],
              correct: 1
            }
          ]
        },
        {
          id: "l1-write-3",
          title: "Mini postcard",
          subtitle: "Write to a pen pal!",
          activities: [
            {
              type: "multiple-choice",
              prompt: "Start a postcard to a friend with...",
              promptLabel: "💌 Dear friend...",
              options: ["Monsieur,", "Cher ami / Chère amie,", "À qui de droit,", "Excusez-moi,"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'J'aime Paris' means...",
              promptLabel: "❤️ Rémi loves it!",
              options: ["I live in Paris", "I love Paris", "I left Paris", "I miss Paris"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "End your postcard with...",
              promptLabel: "👋 Signing off!",
              options: ["Cordialement", "Bisous", "À qui de droit", "En conclusion"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Il fait beau' means...",
              promptLabel: "☀️ Weather update",
              options: ["It's raining", "It's cold", "The weather is nice", "It's snowing"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match postcard phrases!",
              pairs: [
                { french: "J'aime", english: "I love" },
                { french: "Il fait beau", english: "Nice weather" },
                { french: "Je visite", english: "I'm visiting" },
                { french: "C'est magnifique", english: "It's wonderful" }
              ]
            }
          ]
        },
        {
          id: "l1-write-4",
          title: "Days of the week",
          subtitle: "Les jours de la semaine",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Lundi' is...",
              promptLabel: "📅 First day of the week in France!",
              options: ["Sunday", "Monday", "Tuesday", "Saturday"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "The weekend days are...",
              promptLabel: "🎉 Time to relax!",
              options: ["Lundi, Mardi", "Jeudi, Vendredi", "Samedi, Dimanche", "Mercredi, Jeudi"],
              correct: 2
            },
            {
              type: "matching",
              prompt: "Match the days!",
              pairs: [
                { french: "Lundi", english: "Monday" },
                { french: "Mercredi", english: "Wednesday" },
                { french: "Vendredi", english: "Friday" },
                { french: "Dimanche", english: "Sunday" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "'Aujourd'hui' means...",
              promptLabel: "📅 What day is it?",
              options: ["Yesterday", "Today", "Tomorrow", "Always"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Demain' means...",
              promptLabel: "📅 Looking ahead",
              options: ["Today", "Yesterday", "Tomorrow", "Next week"],
              correct: 2
            }
          ]
        }
      ]
    },
    speaking: {
      name: "Speaking Stage",
      desc: "Conversations & mini-theatre",
      icon: "🎤",
      color: "#F37F94",
      lessons: [
        {
          id: "l1-speak-1",
          title: "Say Bonjour!",
          subtitle: "Your first French conversation",
          activities: [
            {
              type: "multiple-choice",
              prompt: "Someone says 'Bonjour!' — You reply...",
              promptLabel: "🗣️ At the bakery",
              options: ["Merci !", "Bonjour !", "Au revoir !", "Pardon !"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Comment allez-vous ?' — The polite reply is...",
              promptLabel: "🗣️ Meeting a teacher",
              options: ["Je m'appelle Rémi", "Très bien, merci !", "Au revoir !", "Oui, s'il vous plaît"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "Someone says 'Merci beaucoup!' You say...",
              promptLabel: "🗣️ Being polite",
              options: ["Bonjour !", "De rien !", "Pardon !", "S'il vous plaît !"],
              correct: 1
            },
            {
              type: "matching",
              prompt: "Match the conversation!",
              pairs: [
                { french: "Bonjour !", english: "Bonjour !" },
                { french: "Ça va ?", english: "Ça va bien !" },
                { french: "Merci !", english: "De rien !" },
                { french: "Au revoir !", english: "À bientôt !" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "'Excusez-moi' is used when you want to...",
              promptLabel: "🗣️ On the metro",
              options: ["Say hello", "Get someone's attention", "Say goodbye", "Order food"],
              correct: 1
            }
          ]
        },
        {
          id: "l1-speak-2",
          title: "At the boulangerie",
          subtitle: "Ordering at the bakery",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Je voudrais un croissant' means...",
              promptLabel: "🥐 At the bakery counter",
              options: ["I have a croissant", "I would like a croissant", "I see a croissant", "I ate a croissant"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "The baker asks 'C'est tout ?' — It means...",
              promptLabel: "🧑‍🍳 The baker waits",
              options: ["How much?", "Is that all?", "What else?", "Cash or card?"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "How much? 'Ça fait combien ?' You hear 'Deux euros' — that's...",
              promptLabel: "💰 Time to pay",
              options: ["€1", "€2", "€3", "€5"],
              correct: 1
            },
            {
              type: "matching",
              prompt: "Match bakery phrases!",
              pairs: [
                { french: "Je voudrais", english: "I would like" },
                { french: "C'est tout", english: "That's all" },
                { french: "Combien", english: "How much" },
                { french: "Merci", english: "Thank you" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "You leave the bakery and say...",
              promptLabel: "👋 Leaving happy!",
              options: ["Bonjour !", "Merci, au revoir !", "Je voudrais...", "Combien ?"],
              correct: 1
            }
          ]
        },
        {
          id: "l1-speak-3",
          title: "Introduce yourself",
          subtitle: "Tell Rémi about you!",
          activities: [
            {
              type: "multiple-choice",
              prompt: "'Je m'appelle ___' is how you say...",
              promptLabel: "🗣️ First time meeting",
              options: ["I live in ___", "My name is ___", "I like ___", "I am ___ years old"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'J'ai dix ans' means...",
              promptLabel: "🗣️ How old are you?",
              options: ["I have ten friends", "I am ten years old", "I want ten things", "I see ten birds"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "Someone asks 'Tu aimes le foot ?' — they're asking if you like...",
              promptLabel: "⚽ At recess",
              options: ["Food", "Football/Soccer", "Music", "School"],
              correct: 1
            },
            {
              type: "matching",
              prompt: "Match about yourself!",
              pairs: [
                { french: "Je m'appelle", english: "My name is" },
                { french: "J'ai ... ans", english: "I am ... years old" },
                { french: "J'habite à", english: "I live in" },
                { french: "J'aime", english: "I like" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "'Je suis français' means...",
              promptLabel: "🇫🇷 Nationality!",
              options: ["I speak French", "I am French", "I love France", "I live in France"],
              correct: 1
            }
          ]
        },
        {
          id: "l1-speak-4",
          title: "Polite words",
          subtitle: "Magic words in French!",
          activities: [
            {
              type: "multiple-choice",
              prompt: "The magic word! 'S'il vous plaît' means...",
              promptLabel: "✨ Always be polite!",
              options: ["Sorry", "Thank you", "Please", "Excuse me"],
              correct: 2
            },
            {
              type: "multiple-choice",
              prompt: "'Pardon' is used when you...",
              promptLabel: "😅 Oops!",
              options: ["Greet someone", "Bump into someone", "Leave a room", "Order food"],
              correct: 1
            },
            {
              type: "multiple-choice",
              prompt: "'Merci beaucoup' means...",
              promptLabel: "🙏 Extra grateful!",
              options: ["Thank you", "Thank you very much", "You're welcome", "Please and thank you"],
              correct: 1
            },
            {
              type: "matching",
              prompt: "Match polite words!",
              pairs: [
                { french: "S'il vous plaît", english: "Please" },
                { french: "Merci", english: "Thank you" },
                { french: "Pardon", english: "Sorry" },
                { french: "De rien", english: "You're welcome" }
              ]
            },
            {
              type: "multiple-choice",
              prompt: "What do you say after someone helps you?",
              promptLabel: "A nice person helped Rémi",
              options: ["Bonjour !", "Au revoir !", "Merci beaucoup !", "Comment ça va ?"],
              correct: 2
            }
          ]
        }
      ]
    }
  }
};

// Badges
const BADGES = [
  { id: "first-star", name: "Première Étoile", icon: "⭐", desc: "Complete your first lesson", condition: (s) => s.lessonsCompleted >= 1 },
  { id: "listener", name: "Bonne Oreille", icon: "🎧", desc: "Complete a Listening lesson", condition: (s) => s.worldsProgress.listening >= 1 },
  { id: "reader", name: "Petit Lecteur", icon: "📖", desc: "Complete a Reading lesson", condition: (s) => s.worldsProgress.reading >= 1 },
  { id: "writer", name: "Écrivain", icon: "✏️", desc: "Complete a Writing lesson", condition: (s) => s.worldsProgress.writing >= 1 },
  { id: "speaker", name: "Bavard(e)", icon: "🎤", desc: "Complete a Speaking lesson", condition: (s) => s.worldsProgress.speaking >= 1 },
  { id: "streak-3", name: "3-Day Streak", icon: "🔥", desc: "Play 3 days in a row", condition: (s) => s.streak >= 3 },
  { id: "star-collector", name: "Star Collector", icon: "🌟", desc: "Earn 20 stars", condition: (s) => s.stars >= 20 },
  { id: "coin-hoarder", name: "Coin Hoarder", icon: "🪙", desc: "Earn 100 coins", condition: (s) => s.coins >= 100 },
  { id: "half-chapter", name: "Mi-Chemin", icon: "🗼", desc: "Complete 8 lessons", condition: (s) => s.lessonsCompleted >= 8 },
  { id: "chapter-done", name: "Chapitre Fini!", icon: "🎉", desc: "Complete all 16 lessons", condition: (s) => s.lessonsCompleted >= 16 },
  { id: "perfect-5", name: "Parfait !", icon: "💎", desc: "Get 3 stars on 5 lessons", condition: (s) => s.perfectLessons >= 5 },
  { id: "explorer", name: "Explorateur", icon: "🗺️", desc: "Try all 4 worlds", condition: (s) => Object.values(s.worldsProgress).every(v => v >= 1) }
];

// Daily tips
const TIPS = [
  { tip: "\"Bonjour\" is the most important word in French! It means \"Hello\" — always say it when you meet someone." },
  { tip: "In France, the week starts on Monday (lundi), not Sunday!" },
  { tip: "\"Merci\" (thank you) and \"S'il vous plaît\" (please) are magic words in French." },
  { tip: "French has masculine (le) and feminine (la) words — even a table is feminine: \"la table\"!" },
  { tip: "The French love their bread! \"Baguette\" means \"little stick\" — how fun!" },
  { tip: "\"Croissant\" means \"crescent\" because of its shape! 🥐" },
  { tip: "In France, people greet with \"la bise\" — a kiss on each cheek!" },
  { tip: "\"Rémi\" is a popular French name meaning \"remedy\" — your fox friend is here to help! 🦊" }
];

// ============================================================
// APP STATE
// ============================================================
const DEFAULT_STATE = {
  name: '',
  ageGroup: null,
  onboarded: false,
  coins: 0,
  stars: 0,
  streak: 0,
  lastPlayDate: null,
  lessonsCompleted: 0,
  perfectLessons: 0,
  completedLessonIds: [],
  worldsProgress: { listening: 0, reading: 0, writing: 0, speaking: 0 },
  badges: []
};

// ============================================================
// APP OBJECT
// ============================================================
const App = {
  state: { ...DEFAULT_STATE },
  currentWorld: null,
  currentLesson: null,
  currentActivityIndex: 0,
  activityCorrect: 0,
  activityTotal: 0,
  matchState: null,

  // --- Initialization ---
  init() {
    this.loadState();
    Auth.init();

    if (this.state.onboarded) {
      this.updateStreak();
      this.showScreen('home');
      this.showNav();
      this.updateHomeScreen();
    }
    // Set daily tip
    const tipEl = document.querySelector('.daily-tip-text');
    if (tipEl) {
      const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
      tipEl.innerHTML = `<strong>Tip from Rémi:</strong> ${tip.tip}`;
    }
  },

  // --- State Management ---
  loadState() {
    const saved = localStorage.getItem('petit-francais-state');
    if (saved) {
      this.state = { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  },

  saveStateLocal() {
    localStorage.setItem('petit-francais-state', JSON.stringify(this.state));
  },

  saveState() {
    this.saveStateLocal();
    this.syncToFirestore();
  },

  async syncToFirestore() {
    if (!db || !Auth.currentUser) return;
    try {
      await db.collection('users').doc(Auth.currentUser.uid).set(this.state, { merge: true });
    } catch (e) {
      // Silently fail — local storage is our source of truth
    }
  },

  // --- Streak ---
  updateStreak() {
    const today = new Date().toDateString();
    if (this.state.lastPlayDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (this.state.lastPlayDate === yesterday.toDateString()) {
      this.state.streak += 1;
    } else if (this.state.lastPlayDate !== today) {
      this.state.streak = 1;
    }
    this.state.lastPlayDate = today;
    this.saveState();
  },

  // --- Navigation ---
  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(`screen-${name}`);
    if (screen) screen.classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-nav="${name}"]`);
    if (navItem) navItem.classList.add('active');

    // Hide nav on splash/onboarding/activity/result
    const hideNavScreens = ['splash', 'onboarding', 'activity', 'result'];
    const nav = document.getElementById('bottom-nav');
    if (hideNavScreens.includes(name)) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
  },

  showNav() {
    document.getElementById('bottom-nav').classList.remove('hidden');
  },

  // --- Onboarding ---
  startOnboarding() {
    this.showScreen('onboarding');
  },

  selectAge(group) {
    this.state.ageGroup = group;
    document.querySelectorAll('.age-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.age-card[data-age="${group}"]`).classList.add('selected');
    this.checkOnboardingReady();
  },

  checkOnboardingReady() {
    const name = document.getElementById('player-name').value.trim();
    const btn = document.getElementById('onboarding-next');
    btn.disabled = !(name.length >= 1 && this.state.ageGroup);
  },

  finishOnboarding() {
    const name = document.getElementById('player-name').value.trim();
    if (!name || !this.state.ageGroup) return;

    this.state.name = name;
    this.state.onboarded = true;
    this.state.coins = 10; // Welcome bonus
    this.state.streak = 1;
    this.state.lastPlayDate = new Date().toDateString();
    this.saveState();

    this.showScreen('home');
    this.showNav();
    this.updateHomeScreen();
  },

  // --- Home Screen ---
  updateHomeScreen() {
    const s = this.state;
    document.getElementById('home-greeting').textContent = `Bonjour, ${s.name} !`;
    document.getElementById('streak-count').textContent = s.streak;
    document.getElementById('total-stars').textContent = s.stars;
    document.getElementById('total-coins').textContent = s.coins;
    document.getElementById('chapter-title').textContent = CHAPTER_DATA.title;

    const totalLessons = 16;
    const pct = Math.round((s.lessonsCompleted / totalLessons) * 100);
    document.getElementById('chapter-progress').style.width = `${pct}%`;
    document.getElementById('chapter-progress-text').textContent = `${s.lessonsCompleted} / ${totalLessons} lessons`;

    // Update world cards
    for (const [worldKey, worldData] of Object.entries(CHAPTER_DATA.worlds)) {
      const card = document.querySelector(`.world-card[data-world="${worldKey}"]`);
      if (!card) continue;
      const done = s.worldsProgress[worldKey] || 0;
      const total = worldData.lessons.length;
      card.querySelector('.world-progress-text').textContent = `${done} / ${total}`;
      card.querySelector('.world-mini-fill').style.width = `${(done / total) * 100}%`;
    }
  },

  goHome() {
    this.updateHomeScreen();
    this.showScreen('home');
  },

  goProfile() {
    this.updateProfileScreen();
    this.showScreen('profile');
  },

  // --- Profile Screen ---
  updateProfileScreen() {
    const s = this.state;
    document.getElementById('profile-name').textContent = s.name || 'Player';
    document.getElementById('profile-stars').textContent = s.stars;
    document.getElementById('profile-coins').textContent = s.coins;
    document.getElementById('profile-lessons').textContent = s.lessonsCompleted;
    Auth.updateUI(Auth.currentUser);

    const grid = document.getElementById('badges-grid');
    grid.innerHTML = '';

    BADGES.forEach(badge => {
      const earned = badge.condition(s);
      const div = document.createElement('div');
      div.className = `badge-item${earned ? '' : ' locked'}`;
      div.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
      `;
      div.title = badge.desc;
      grid.appendChild(div);
    });
  },

  // --- World / Lessons ---
  openWorld(worldKey) {
    this.currentWorld = worldKey;
    const world = CHAPTER_DATA.worlds[worldKey];
    document.getElementById('lessons-world-name').textContent = world.name;
    document.getElementById('lessons-world-desc').textContent = world.desc;

    const list = document.getElementById('lessons-list');
    list.innerHTML = '';

    world.lessons.forEach((lesson, i) => {
      const completed = this.state.completedLessonIds.includes(lesson.id);
      const prevCompleted = i === 0 || this.state.completedLessonIds.includes(world.lessons[i - 1].id);
      const locked = !prevCompleted && !completed;

      const stars = completed ? this.getLessonStars(lesson.id) : '';
      const starsHtml = completed
        ? `<div class="lesson-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`
        : locked
          ? '<div class="lesson-stars">🔒</div>'
          : '<div class="lesson-stars">→</div>';

      const card = document.createElement('div');
      card.className = `lesson-card${locked ? ' locked' : ''}`;
      card.innerHTML = `
        <div class="lesson-number" style="background:${world.color}">${i + 1}</div>
        <div class="lesson-info">
          <div class="lesson-title">${lesson.title}</div>
          <div class="lesson-subtitle">${lesson.subtitle}</div>
        </div>
        ${starsHtml}
      `;

      if (!locked) {
        card.onclick = () => this.startLesson(worldKey, i);
      }

      list.appendChild(card);
    });

    this.showScreen('lessons');
  },

  getLessonStars(lessonId) {
    const stored = localStorage.getItem(`stars-${lessonId}`);
    return stored ? parseInt(stored) : 0;
  },

  // --- Activities ---
  startLesson(worldKey, lessonIndex) {
    const world = CHAPTER_DATA.worlds[worldKey];
    this.currentWorld = worldKey;
    this.currentLesson = world.lessons[lessonIndex];
    this.currentActivityIndex = 0;
    this.activityCorrect = 0;
    this.activityTotal = this.currentLesson.activities.length;
    this.matchState = null;

    this.showScreen('activity');
    this.renderActivity();
  },

  renderActivity() {
    const activity = this.currentLesson.activities[this.currentActivityIndex];
    const body = document.getElementById('activity-body');
    const pct = ((this.currentActivityIndex) / this.activityTotal) * 100;
    document.getElementById('activity-progress-fill').style.width = `${pct}%`;
    document.getElementById('activity-count').textContent = `${this.currentActivityIndex + 1} / ${this.activityTotal}`;

    if (activity.type === 'multiple-choice') {
      this.renderMultipleChoice(body, activity);
    } else if (activity.type === 'matching') {
      this.renderMatching(body, activity);
    }
  },

  renderMultipleChoice(body, activity) {
    body.innerHTML = `
      <div class="activity-prompt">
        <div class="activity-prompt-label">${activity.promptLabel}</div>
        <div class="activity-prompt-text">${activity.prompt}</div>
      </div>
      <div class="activity-options">
        ${activity.options.map((opt, i) => `
          <button class="activity-option" onclick="App.checkAnswer(${i}, ${activity.correct})">
            ${opt}
          </button>
        `).join('')}
      </div>
    `;
  },

  checkAnswer(selected, correct) {
    const options = document.querySelectorAll('.activity-option');
    options.forEach((opt, i) => {
      opt.classList.add('disabled');
      if (i === correct) opt.classList.add('correct');
      if (i === selected && i !== correct) opt.classList.add('wrong');
    });

    if (selected === correct) {
      this.activityCorrect++;
    }

    setTimeout(() => this.nextActivity(), 1200);
  },

  renderMatching(body, activity) {
    const pairs = activity.pairs;
    // Shuffle the english side
    const shuffledEnglish = [...pairs.map(p => p.english)].sort(() => Math.random() - 0.5);

    this.matchState = {
      pairs,
      shuffledEnglish,
      selectedFrench: null,
      selectedEnglish: null,
      matched: new Set(),
      attempts: 0
    };

    body.innerHTML = `
      <div class="activity-prompt">
        <div class="activity-prompt-label">Tap to match!</div>
        <div class="activity-prompt-text">${activity.prompt}</div>
      </div>
      <div class="match-grid" id="match-grid">
        ${pairs.map((p, i) => `
          <div class="match-card" data-type="french" data-index="${i}" onclick="App.tapMatch('french', ${i})">
            ${p.french}
          </div>
          <div class="match-card" data-type="english" data-index="${i}" onclick="App.tapMatch('english', ${i})">
            ${shuffledEnglish[i]}
          </div>
        `).join('')}
      </div>
    `;
  },

  tapMatch(type, index) {
    const ms = this.matchState;
    if (!ms) return;

    const card = document.querySelector(`.match-card[data-type="${type}"][data-index="${index}"]`);
    if (card.classList.contains('matched')) return;

    // Deselect same type
    document.querySelectorAll(`.match-card[data-type="${type}"]`).forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    if (type === 'french') ms.selectedFrench = index;
    else ms.selectedEnglish = index;

    // Check if both selected
    if (ms.selectedFrench !== null && ms.selectedEnglish !== null) {
      ms.attempts++;
      const frenchPair = ms.pairs[ms.selectedFrench];
      const englishValue = ms.shuffledEnglish[ms.selectedEnglish];

      if (frenchPair.english === englishValue) {
        // Match!
        const fc = document.querySelector(`.match-card[data-type="french"][data-index="${ms.selectedFrench}"]`);
        const ec = document.querySelector(`.match-card[data-type="english"][data-index="${ms.selectedEnglish}"]`);
        fc.classList.add('matched');
        ec.classList.add('matched');
        fc.classList.remove('selected');
        ec.classList.remove('selected');
        ms.matched.add(ms.selectedFrench);

        if (ms.matched.size === ms.pairs.length) {
          // All matched!
          if (ms.attempts <= ms.pairs.length + 1) {
            this.activityCorrect++;
          }
          setTimeout(() => this.nextActivity(), 800);
        }
      } else {
        // Wrong — flash then deselect
        setTimeout(() => {
          document.querySelectorAll('.match-card.selected').forEach(c => c.classList.remove('selected'));
        }, 500);
      }

      ms.selectedFrench = null;
      ms.selectedEnglish = null;
    }
  },

  nextActivity() {
    this.currentActivityIndex++;
    if (this.currentActivityIndex >= this.activityTotal) {
      this.finishLesson();
    } else {
      this.renderActivity();
    }
  },

  exitActivity() {
    if (this.currentWorld) {
      this.openWorld(this.currentWorld);
    } else {
      this.goHome();
    }
  },

  // --- Lesson Complete ---
  finishLesson() {
    const pct = this.activityCorrect / this.activityTotal;
    let stars = 1;
    if (pct >= 0.8) stars = 2;
    if (pct >= 1.0) stars = 3;

    const coins = this.activityCorrect * 2 + 4; // base 4 + 2 per correct
    const lessonId = this.currentLesson.id;
    const isNew = !this.state.completedLessonIds.includes(lessonId);

    // Update state
    if (isNew) {
      this.state.completedLessonIds.push(lessonId);
      this.state.lessonsCompleted++;
      this.state.worldsProgress[this.currentWorld] = (this.state.worldsProgress[this.currentWorld] || 0) + 1;
    }
    this.state.stars += stars;
    this.state.coins += coins;

    if (stars === 3) this.state.perfectLessons++;

    // Save star rating for this lesson
    const prevStars = this.getLessonStars(lessonId);
    if (stars > prevStars) {
      localStorage.setItem(`stars-${lessonId}`, stars);
    }

    this.updateStreak();
    this.saveState();

    // Render result
    const titles = ['Bien joué !', 'Très bien !', 'Magnifique !'];
    const subtitles = [
      'Keep practicing to earn more stars!',
      'Great work — almost perfect!',
      'Perfect score! Rémi is so proud! 🦊'
    ];

    document.getElementById('result-title').textContent = titles[stars - 1];
    document.getElementById('result-subtitle').textContent = subtitles[stars - 1];
    document.getElementById('result-correct').textContent = `${this.activityCorrect}/${this.activityTotal}`;
    document.getElementById('result-coins').textContent = `+${coins}`;

    const starsEl = document.getElementById('result-stars');
    starsEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      span.className = 'result-star';
      span.textContent = i < stars ? '⭐' : '☆';
      starsEl.appendChild(span);
    }

    this.showScreen('result');

    if (stars === 3) this.showConfetti();
  },

  nextLesson() {
    if (this.currentWorld) {
      this.openWorld(this.currentWorld);
    } else {
      this.goHome();
    }
  },

  // --- Confetti ---
  showConfetti() {
    const container = document.getElementById('confetti');
    container.classList.remove('hidden');
    container.innerHTML = '';
    const colors = ['#F37F94', '#FCB315', '#099197', '#A36AA5', '#FFF5F2'];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = `${-10 + Math.random() * 20}px`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${6 + Math.random() * 8}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.classList.add('hidden');
      container.innerHTML = '';
    }, 4000);
  }
};

// --- Init on load ---
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // Enable onboarding button when name changes
  const nameInput = document.getElementById('player-name');
  if (nameInput) {
    nameInput.addEventListener('input', () => App.checkOnboardingReady());
  }
});
