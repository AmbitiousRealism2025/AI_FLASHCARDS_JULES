// src/data/mockData.ts

export interface Flashcard {
  id: string;
  category: string;
  term: string;
  definition: string;
  example?: string;
  staticChallenge?: string; // New optional field for static challenges
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  threshold: number;
  category?: string;
  icon: string;
}

export const flashcards: Flashcard[] = [
  {
    id: 'ai-concept-01',
    category: 'Machine Learning',
    term: 'Supervised Learning',
    definition: 'A type of machine learning where the model learns from labeled data, meaning each training example is paired with an output label.',
    example: 'Training a model to classify emails as "spam" or "not spam" based on emails that have already been labeled.'
  },
  {
    id: 'ai-concept-02',
    category: 'Machine Learning',
    term: 'Unsupervised Learning',
    definition: 'A type of machine learning where the model learns from unlabeled data, identifying patterns and structures on its own.',
    example: 'Clustering news articles into different topics without predefined categories.'
  },
  {
    id: 'ai-concept-03',
    category: 'Machine Learning',
    term: 'Reinforcement Learning',
    definition: 'A type of machine learning where an agent learns to make decisions by taking actions in an environment to achieve a goal, receiving rewards or penalties for its actions.',
    example: 'Training a robot to navigate a maze by rewarding it for reaching the exit.'
  },
  {
    id: 'ai-concept-04',
    category: 'Machine Learning',
    term: 'Overfitting',
    definition: 'A modeling error that occurs when a function is too closely fit to a limited set of data points. It may therefore fail to predict future observations reliably.',
    example: 'A decision tree that has learned the training data so perfectly that it performs poorly on unseen test data.',
    staticChallenge: 'What are two common techniques to mitigate overfitting in a machine learning model?'
  },
  {
    id: 'ai-concept-05',
    category: 'Machine Learning',
    term: 'Underfitting',
    definition: 'A modeling error that occurs when a function is not complex enough to capture the underlying trend in the data.',
    example: 'Using a linear model to fit non-linear data, resulting in poor performance on both training and test sets.'
  },
  {
    id: 'nn-concept-01',
    category: 'Neural Networks',
    term: 'Artificial Neuron',
    definition: 'A mathematical function conceived as a model of biological neurons. It receives one or more inputs and sums them to produce an output.',
    example: 'A perceptron unit in a neural network.',
    staticChallenge: 'What is the primary purpose of a weight in an artificial neuron?'
  },
  {
    id: 'nn-concept-02',
    category: 'Neural Networks',
    term: 'Activation Function',
    definition: 'A function in a neural network that defines the output of a neuron given a set of inputs. It introduces non-linearity into the network.',
    example: 'Sigmoid, ReLU (Rectified Linear Unit), Tanh.'
  },
  {
    id: 'nn-concept-03',
    category: 'Neural Networks',
    term: 'Backpropagation',
    definition: 'An algorithm used to train artificial neural networks by calculating the gradient of the loss function with respect to the network\'s weights.',
  },
  {
    id: 'nn-concept-04',
    category: 'Neural Networks',
    term: 'Convolutional Neural Network (CNN)',
    definition: 'A class of deep neural networks, most commonly applied to analyzing visual imagery.',
    example: 'Image classification, object detection.'
  },
  {
    id: 'nn-concept-05',
    category: 'Neural Networks',
    term: 'Recurrent Neural Network (RNN)',
    definition: 'A class of artificial neural networks where connections between nodes form a directed graph along a temporal sequence. This allows it to exhibit temporal dynamic behavior.',
    example: 'Natural language processing, speech recognition.'
  },
  {
    id: 'nlp-concept-01',
    category: 'NLP',
    term: 'Tokenization',
    definition: 'The process of breaking down a text into smaller units called tokens (e.g., words, subwords, or characters).',
    example: 'Splitting the sentence "Hello world!" into tokens ["Hello", "world", "!"]',
    staticChallenge: 'Why is tokenization a crucial first step in most NLP tasks?'
  },
  {
    id: 'nlp-concept-02',
    category: 'NLP',
    term: 'Stemming',
    definition: 'The process of reducing inflected (or sometimes derived) words to their word stem, base or root form.',
    example: 'Reducing "running", "runs", "ran" to "run".'
  },
  {
    id: 'nlp-concept-03',
    category: 'NLP',
    term: 'Lemmatization',
    definition: 'The process of grouping together the inflected forms of a word so they can be analyzed as a single item, identified by the word\'s lemma, or dictionary form.',
    example: 'Reducing "better" to "good", or "running" to "run".'
  },
  {
    id: 'nlp-concept-04',
    category: 'NLP',
    term: 'Embeddings',
    definition: 'Representations of words or phrases as vectors of real numbers, capturing semantic relationships.',
    example: 'Word2Vec, GloVe, FastText.'
  },
  {
    id: 'nlp-concept-05',
    category: 'NLP',
    term: 'Transformer Model',
    definition: 'A deep learning model architecture that uses self-attention mechanisms to process input data in parallel, widely used in NLP.',
    example: 'BERT, GPT (Generative Pre-trained Transformer).'
  },
  {
    id: 'ai-ethics-01',
    category: 'AI Ethics',
    term: 'Algorithmic Bias',
    definition: 'Systematic and repeatable errors in a computer system that create unfair outcomes, such as privileging one arbitrary group of users over others.',
    example: 'A hiring algorithm that disproportionately filters out candidates from a certain demographic due to biases in the training data.',
    staticChallenge: 'How can using diverse datasets help in reducing algorithmic bias?'
  },
  {
    id: 'ai-ethics-02',
    category: 'AI Ethics',
    term: 'Explainability (XAI)',
    definition: 'The ability to explain the decisions or predictions made by an AI system in a way that is understandable to humans.',
  },
  {
    id: 'data-science-01',
    category: 'Data Science',
    term: 'Data Mining',
    definition: 'The process of discovering patterns in large data sets involving methods at the intersection of machine learning, statistics, and database systems.',
  },
  {
    id: 'data-science-02',
    category: 'Data Science',
    term: 'Feature Engineering',
    definition: 'The process of using domain knowledge to create features that make machine learning algorithms work better.',
    example: 'Creating a new feature "age_squared" if you suspect a non-linear relationship between age and an outcome.'
  },
  {
    id: 'data-science-03',
    category: 'Data Science',
    term: 'Cross-Validation',
    definition: 'A resampling procedure used to evaluate machine learning models on a limited data sample by partitioning the data into subsets, training on some and testing on others.',
  },
  {
    id: 'deep-learning-01',
    category: 'Deep Learning',
    term: 'Deep Learning',
    definition: 'A subfield of machine learning concerned with algorithms inspired by the structure and function of the brain called artificial neural networks, particularly those with many layers.',
    staticChallenge: 'What is one key advantage of Deep Learning models over traditional Machine Learning models for tasks like image recognition?'
  },
  {
    id: 'deep-learning-02',
    category: 'Deep Learning',
    term: 'Generative Adversarial Network (GAN)',
    definition: 'A class of machine learning frameworks where two neural networks (generator and discriminator) contest with each other in a zero-sum game framework.',
    example: 'Generating realistic images, video, or audio.'
  }
];

export const badgeThresholds: Badge[] = [
  {
    id: 'badge-ml-novice',
    name: 'ML Novice',
    description: 'Understood 5 Machine Learning concepts.',
    threshold: 5,
    category: 'Machine Learning',
    icon: '🌟',
  },
  {
    id: 'badge-nn-explorer',
    name: 'Neural Network Explorer',
    description: 'Understood 3 Neural Network concepts.',
    threshold: 3,
    category: 'Neural Networks',
    icon: '🧠',
  },
  {
    id: 'badge-nlp-initiate',
    name: 'NLP Initiate',
    description: 'Understood 3 NLP concepts.',
    threshold: 3,
    category: 'NLP',
    icon: '🗣️',
  },
  {
    id: 'badge-ai-adept',
    name: 'AI Adept',
    description: 'Understood 10 concepts across all categories.',
    threshold: 10,
    icon: '💡',
  },
  {
    id: 'badge-concept-conqueror',
    name: 'Concept Conqueror',
    description: 'Understood 20 concepts across all categories.',
    threshold: 20,
    icon: '🏆',
  },
];
