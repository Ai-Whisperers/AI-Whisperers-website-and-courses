# Course 3: AI-Powered Web Apps - Building Intelligent Interfaces

## 📋 Course Overview

**Course Title:** AI-Powered Web Apps: Building Intelligent Interfaces  
**Target Audience:** Web developers wanting to integrate AI into applications  
**Duration:** 7 lessons (21 hours total, 3 hours per lesson)  
**Format:** Intensive coding workshops with production deployment  
**Prerequisites:** JavaScript/TypeScript, React basics, REST API experience, Node.js familiarity  

### 🎯 Course Learning Outcomes
By the end of this course, students will be able to:
- Build full-stack AI applications using React/Next.js and FastAPI/Express
- Implement real-time AI interactions with streaming responses
- Connect and orchestrate multiple AI models and services
- Deploy scalable AI applications to production environments
- Handle complex AI workflows with proper error management
- Create responsive, accessible AI interfaces with excellent UX

---

## 📚 Lesson Structure

### Lesson 1: Modern Frontend Architecture for AI Applications
**Duration:** 3 hours  
**Format:** Architecture workshop with hands-on React development

#### Learning Objectives
1. **Design React component architectures** optimized for AI interactions
2. **Implement advanced state management** for complex AI workflows
3. **Handle asynchronous AI operations** with proper loading and error states
4. **Create reusable AI interface components** with TypeScript
5. **Build responsive layouts** that work across devices for AI applications

#### Practical Exercise: AI Component Library
**Activity:** Build a comprehensive React component library for AI interfaces
```typescript
// Core AI interaction hook
import { useState, useCallback } from 'react';

interface AIResponse {
  data: any;
  loading: boolean;
  error: string | null;
}

export const useAI = (endpoint: string) => {
  const [response, setResponse] = useState<AIResponse>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (payload: any) => {
    setResponse(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`AI request failed: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse({ data, loading: false, error: null });
    } catch (error) {
      setResponse(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  }, [endpoint]);

  return { ...response, execute };
};

// Advanced AI Chat Component
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { execute, loading, error } = useAI('chat');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    await execute({
      messages: [...messages, userMessage],
      model: 'gpt-4',
    });
  };

  return (
    <div className="ai-chat-container">
      <MessageList messages={messages} loading={loading} error={error} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        disabled={loading}
      />
    </div>
  );
};
```

**Component Library Features:**
- **AIChat:** Real-time conversation interface with streaming
- **AITextGenerator:** Form-based text generation with templates
- **AIImageAnalyzer:** Upload and analyze images with AI
- **AIDocumentProcessor:** Drag-and-drop document analysis
- **LoadingStates:** Sophisticated loading animations for AI operations
- **ErrorBoundaries:** Graceful error handling for AI failures

#### Advanced React Patterns for AI
```typescript
// Context for AI application state
interface AIAppContext {
  models: Record<string, AIModel>;
  usage: UsageMetrics;
  settings: AISettings;
}

const AIAppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(aiAppReducer, initialState);
  
  return (
    <AIContext.Provider value={{ state, dispatch }}>
      {children}
    </AIContext.Provider>
  );
};

// Higher-order component for AI functionality
const withAI = <T extends object>(Component: React.ComponentType<T>) => {
  return (props: T) => {
    const aiContext = useContext(AIContext);
    return <Component {...props} ai={aiContext} />;
  };
};
```

**Estimated Duration:** 3 hours
- React architecture principles for AI: 45 minutes
- Component library development: 135 minutes

---

### Lesson 2: Backend API Development with FastAPI and Express
**Duration:** 3 hours  
**Format:** Backend development workshop with API design

#### Learning Objectives
1. **Build scalable REST APIs** for AI applications using FastAPI and Express
2. **Implement authentication and authorization** for AI endpoints
3. **Handle file uploads and processing** for AI analysis
4. **Create WebSocket connections** for real-time AI streaming
5. **Design database schemas** for AI application data

#### Practical Exercise: Dual Backend Development
**Activity:** Build the same AI API using both FastAPI (Python) and Express (Node.js)

**FastAPI Implementation:**
```python
from fastapi import FastAPI, File, UploadFile, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import asyncio
from typing import List

app = FastAPI(title="AI Web App Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database models
class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    messages = relationship("Message", back_populates="session")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(String)  # 'user' or 'assistant'
    content = Column(Text)
    metadata = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)

# API endpoints
@app.post("/api/chat")
async def chat_completion(
    request: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Save user message
    user_message = Message(
        session_id=request.session_id,
        role="user",
        content=request.message,
    )
    db.add(user_message)
    db.commit()

    # Generate AI response
    ai_response = await openai_client.chat.completions.create(
        model=request.model or "gpt-3.5-turbo",
        messages=[
            {"role": msg.role, "content": msg.content}
            for msg in get_session_messages(db, request.session_id)
        ] + [{"role": "user", "content": request.message}],
        max_tokens=request.max_tokens or 500,
    )

    # Save AI response
    ai_message = Message(
        session_id=request.session_id,
        role="assistant",
        content=ai_response.choices[0].message.content,
        metadata={
            "model": request.model,
            "tokens": ai_response.usage.total_tokens,
            "cost": calculate_cost(ai_response.usage, request.model),
        },
    )
    db.add(ai_message)
    db.commit()

    return {
        "message": ai_response.choices[0].message.content,
        "usage": ai_response.usage,
        "metadata": ai_message.metadata,
    }

@app.websocket("/ws/chat/{session_id}")
async def chat_websocket(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            request = ChatRequest.parse_raw(data)
            
            # Stream response
            async for chunk in openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": request.message}],
                stream=True,
            ):
                if chunk.choices[0].delta.content:
                    await websocket.send_text(chunk.choices[0].delta.content)
                    
    except WebSocketDisconnect:
        pass

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Process uploaded file
    content = await file.read()
    
    # Extract text based on file type
    if file.content_type == "application/pdf":
        text = extract_pdf_text(content)
    elif file.content_type in ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        text = extract_word_text(content)
    else:
        text = content.decode("utf-8")
    
    # Analyze with AI
    analysis = await analyze_document(text)
    
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "text_length": len(text),
        "analysis": analysis,
    }
```

**Express.js Implementation:**
```typescript
import express from 'express';
import { WebSocketServer } from 'ws';
import multer from 'multer';
import { OpenAI } from 'openai';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Multer setup for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

interface ChatRequest {
  sessionId: string;
  message: string;
  model?: string;
  maxTokens?: number;
}

app.post('/api/chat', async (req: express.Request<{}, {}, ChatRequest>, res) => {
  try {
    const { sessionId, message, model = 'gpt-3.5-turbo', maxTokens = 500 } = req.body;

    // Save user message to database
    await prisma.message.create({
      data: {
        sessionId,
        role: 'user',
        content: message,
      },
    });

    // Get conversation history
    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    });

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      max_tokens: maxTokens,
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI response
    await prisma.message.create({
      data: {
        sessionId,
        role: 'assistant',
        content: aiResponse,
        metadata: {
          model,
          tokens: completion.usage?.total_tokens,
          cost: calculateCost(completion.usage, model),
        },
      },
    });

    res.json({
      message: aiResponse,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from file
    let text: string;
    if (req.file.mimetype === 'application/pdf') {
      text = await extractPDFText(req.file.buffer);
    } else if (req.file.mimetype.includes('word')) {
      text = await extractWordText(req.file.buffer);
    } else {
      text = req.file.buffer.toString('utf-8');
    }

    // Analyze with AI
    const analysis = await analyzeDocument(text);

    res.json({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      textLength: text.length,
      analysis,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File processing failed' });
  }
});

// WebSocket setup for real-time chat
const server = app.listen(8000);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    try {
      const request = JSON.parse(data.toString()) as ChatRequest;
      
      // Stream AI response
      const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: request.message }],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          ws.send(JSON.stringify({ type: 'chunk', content }));
        }
      }

      ws.send(JSON.stringify({ type: 'done' }));
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });
});
```

#### Database Schema Design
```sql
-- PostgreSQL schema for AI application
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id),
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    model VARCHAR(100) NOT NULL,
    tokens_used INTEGER NOT NULL,
    cost_usd DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_messages_session_timestamp ON messages(session_id, timestamp);
CREATE INDEX idx_usage_user_date ON ai_usage(user_id, created_at);
```

**Estimated Duration:** 3 hours
- API design principles: 30 minutes
- FastAPI implementation: 75 minutes
- Express.js implementation: 75 minutes

---

### Lesson 3: Real-time AI Interactions and Streaming
**Duration:** 3 hours  
**Format:** WebSocket and streaming workshop

#### Learning Objectives
1. **Implement WebSocket connections** for real-time AI communication
2. **Handle streaming AI responses** with proper buffering and display
3. **Build collaborative AI features** with multiple users
4. **Manage connection state and reconnection** for robust user experience
5. **Optimize streaming performance** for large-scale applications

#### Practical Exercise: Real-time Collaborative AI Writing Tool
**Activity:** Build a Google Docs-style collaborative writing tool with AI assistance

**Frontend Streaming Implementation:**
```typescript
// Real-time streaming hook
export const useAIStream = (endpoint: string) => {
  const [streamData, setStreamData] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startStream = useCallback(async (payload: any) => {
    setIsStreaming(true);
    setStreamData('');
    setError(null);

    try {
      // Option 1: WebSocket streaming
      const ws = new WebSocket(`ws://localhost:8000/stream/${endpoint}`);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chunk') {
          setStreamData(prev => prev + data.content);
        } else if (data.type === 'done') {
          setIsStreaming(false);
          ws.close();
        } else if (data.type === 'error') {
          setError(data.message);
          setIsStreaming(false);
        }
      };

      ws.onerror = () => {
        setError('Connection error');
        setIsStreaming(false);
      };

    } catch (err) {
      setError(err.message);
      setIsStreaming(false);
    }
  }, [endpoint]);

  const stopStream = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  return {
    streamData,
    isStreaming,
    error,
    startStream,
    stopStream,
  };
};

// Collaborative AI Writer Component
const CollaborativeAIWriter: React.FC = () => {
  const [document, setDocument] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const { streamData, isStreaming, startStream, stopStream } = useAIStream('write');

  // WebSocket for collaboration
  useEffect(() => {
    const collaborationWS = new WebSocket('ws://localhost:8000/collaborate');
    
    collaborationWS.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'document_update':
          setDocument(data.content);
          break;
        case 'user_joined':
          setCollaborators(prev => [...prev, data.user]);
          break;
        case 'user_left':
          setCollaborators(prev => prev.filter(u => u.id !== data.userId));
          break;
        case 'cursor_update':
          // Update other users' cursors
          updateCollaboratorCursor(data.userId, data.position);
          break;
      }
    };

    return () => collaborationWS.close();
  }, []);

  const handleAIAssist = async (prompt: string) => {
    const context = document.substring(
      Math.max(0, selection.start - 500),
      Math.min(document.length, selection.end + 500)
    );

    await startStream({
      prompt,
      context,
      selection: { start: selection.start, end: selection.end },
    });
  };

  const insertAIContent = () => {
    const newContent = 
      document.slice(0, selection.start) + 
      streamData + 
      document.slice(selection.end);
    
    setDocument(newContent);
    
    // Broadcast update to collaborators
    broadcastDocumentUpdate(newContent);
  };

  return (
    <div className="collaborative-writer">
      <Toolbar>
        <AIAssistPanel onRequest={handleAIAssist} />
        <CollaboratorsList collaborators={collaborators} />
      </Toolbar>
      
      <Editor
        value={document}
        onChange={setDocument}
        onSelectionChange={setSelection}
        collaborators={collaborators}
      />
      
      {isStreaming && (
        <StreamingPreview
          content={streamData}
          onAccept={insertAIContent}
          onReject={stopStream}
        />
      )}
    </div>
  );
};
```

**Backend Streaming Server:**
```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List
import asyncio
import json

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_sessions: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)
        self.user_sessions[websocket] = session_id

    def disconnect(self, websocket: WebSocket):
        session_id = self.user_sessions.get(websocket)
        if session_id and session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            del self.user_sessions[websocket]

    async def broadcast_to_session(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    # Remove broken connections
                    self.active_connections[session_id].remove(connection)

manager = ConnectionManager()

@app.websocket("/stream/write")
async def ai_writing_stream(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            request = json.loads(data)
            
            # Stream AI response
            async for chunk in openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful writing assistant."},
                    {"role": "user", "content": f"Context: {request['context']}\n\nRequest: {request['prompt']}"}
                ],
                stream=True,
            ):
                if chunk.choices[0].delta.content:
                    await websocket.send_text(json.dumps({
                        "type": "chunk",
                        "content": chunk.choices[0].delta.content
                    }))
                    
                    # Small delay to prevent overwhelming
                    await asyncio.sleep(0.01)
            
            await websocket.send_text(json.dumps({"type": "done"}))
                    
    except WebSocketDisconnect:
        pass

@app.websocket("/collaborate/{session_id}")
async def collaborative_editing(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast to all users in the session
            await manager.broadcast_to_session(session_id, message)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

#### Advanced Streaming Features
```typescript
// Streaming with cancellation and retry
class StreamingAIClient {
  private abortController: AbortController | null = null;
  
  async streamCompletion(
    prompt: string,
    options: StreamOptions = {}
  ): Promise<AsyncIterableIterator<string>> {
    this.abortController = new AbortController();
    
    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ...options }),
      signal: this.abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`Streaming failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    return {
      async *[Symbol.asyncIterator]() {
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.trim() && line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data !== '[DONE]') {
                  try {
                    const parsed = JSON.parse(data);
                    yield parsed.choices[0]?.delta?.content || '';
                  } catch (e) {
                    console.warn('Failed to parse chunk:', data);
                  }
                }
              }
            }
          }
        } finally {
          reader?.releaseLock();
        }
      }
    };
  }

  cancel() {
    this.abortController?.abort();
  }
}
```

**Estimated Duration:** 3 hours
- WebSocket fundamentals: 30 minutes
- Streaming implementation: 120 minutes
- Collaborative features: 30 minutes

---

### Lesson 4: Connecting Multiple AI Models and Services
**Duration:** 3 hours  
**Format:** Advanced integration workshop

#### Learning Objectives
1. **Orchestrate multiple AI services** in complex workflows
2. **Implement AI model routing** and fallback strategies
3. **Build AI pipeline architectures** for multi-step processing
4. **Handle cross-service authentication** and rate limiting
5. **Create unified AI interfaces** that abstract provider differences

#### Practical Exercise: AI Content Creation Pipeline
**Activity:** Build a system that uses multiple AI services for comprehensive content creation

**Multi-Service Orchestration:**
```typescript
// AI Service Registry and Router
interface AIProvider {
  name: string;
  models: string[];
  capabilities: string[];
  costPerToken: number;
  maxTokens: number;
  rateLimits: RateLimit;
}

class AIServiceOrchestrator {
  private providers: Map<string, AIProvider> = new Map();
  private clients: Map<string, any> = new Map();
  private usageTracker = new UsageTracker();

  constructor() {
    this.registerProvider('openai', {
      name: 'OpenAI',
      models: ['gpt-4', 'gpt-3.5-turbo', 'dall-e-3'],
      capabilities: ['text-generation', 'image-generation', 'code-generation'],
      costPerToken: 0.00003,
      maxTokens: 4096,
      rateLimits: { requestsPerMinute: 3000, tokensPerMinute: 150000 }
    });

    this.registerProvider('anthropic', {
      name: 'Anthropic',
      models: ['claude-3-opus', 'claude-3-sonnet'],
      capabilities: ['text-generation', 'analysis', 'reasoning'],
      costPerToken: 0.000015,
      maxTokens: 200000,
      rateLimits: { requestsPerMinute: 1000, tokensPerMinute: 100000 }
    });

    this.registerProvider('huggingface', {
      name: 'Hugging Face',
      models: ['llama2', 'stable-diffusion-xl'],
      capabilities: ['text-generation', 'image-generation', 'classification'],
      costPerToken: 0.000005,
      maxTokens: 2048,
      rateLimits: { requestsPerMinute: 1000, tokensPerMinute: 50000 }
    });
  }

  async executeWorkflow(workflow: AIWorkflow): Promise<WorkflowResult> {
    const results = new Map<string, any>();
    
    for (const step of workflow.steps) {
      try {
        const provider = this.selectOptimalProvider(step);
        const result = await this.executeStep(step, provider, results);
        results.set(step.id, result);
      } catch (error) {
        // Try fallback providers
        const fallbackResult = await this.executeFallback(step, results);
        results.set(step.id, fallbackResult);
      }
    }

    return new WorkflowResult(results);
  }

  private selectOptimalProvider(step: WorkflowStep): string {
    const candidates = Array.from(this.providers.values())
      .filter(provider => 
        provider.capabilities.includes(step.capability) &&
        provider.models.some(model => step.models?.includes(model) || !step.models)
      )
      .sort((a, b) => {
        // Score by cost, capability, and current usage
        const costScore = a.costPerToken - b.costPerToken;
        const usageScore = this.usageTracker.getCurrentUsage(a.name) - 
                          this.usageTracker.getCurrentUsage(b.name);
        return costScore + (usageScore * 0.1);
      });

    return candidates[0]?.name || 'openai';
  }
}

// Complex AI Workflow Definition
interface ContentCreationWorkflow {
  steps: [
    {
      id: 'research',
      capability: 'text-generation',
      provider: 'claude-3-opus',
      prompt: 'Research and outline: {topic}',
      dependencies: []
    },
    {
      id: 'write-draft',
      capability: 'text-generation', 
      provider: 'gpt-4',
      prompt: 'Write article based on: {research.result}',
      dependencies: ['research']
    },
    {
      id: 'create-images',
      capability: 'image-generation',
      provider: 'dall-e-3',
      prompt: 'Create illustrations for: {write-draft.title}',
      dependencies: ['write-draft']
    },
    {
      id: 'optimize-seo',
      capability: 'text-generation',
      provider: 'gpt-3.5-turbo',
      prompt: 'Optimize for SEO: {write-draft.result}',
      dependencies: ['write-draft']
    },
    {
      id: 'fact-check',
      capability: 'analysis',
      provider: 'claude-3-sonnet',
      prompt: 'Fact-check and verify: {write-draft.result}',
      dependencies: ['write-draft']
    }
  ];
}
```

**Advanced Pipeline Implementation:**
```python
# Python-based AI Pipeline
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import asyncio
from abc import ABC, abstractmethod

@dataclass
class PipelineStep:
    id: str
    provider: str
    model: str
    prompt_template: str
    dependencies: List[str]
    parallel_execution: bool = False
    retry_count: int = 3
    timeout_seconds: int = 30

class AIProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, model: str, **kwargs) -> Dict[str, Any]:
        pass

class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
    
    async def generate(self, prompt: str, model: str, **kwargs) -> Dict[str, Any]:
        response = await self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            **kwargs
        )
        return {
            "content": response.choices[0].message.content,
            "usage": response.usage,
            "model": model
        }

class AnthropicProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
    
    async def generate(self, prompt: str, model: str, **kwargs) -> Dict[str, Any]:
        response = await self.client.messages.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            **kwargs
        )
        return {
            "content": response.content[0].text,
            "usage": response.usage,
            "model": model
        }

class AIPipeline:
    def __init__(self):
        self.providers = {
            "openai": OpenAIProvider(os.getenv("OPENAI_API_KEY")),
            "anthropic": AnthropicProvider(os.getenv("ANTHROPIC_API_KEY"))
        }
        self.results: Dict[str, Any] = {}
        
    async def execute(self, steps: List[PipelineStep], input_data: Dict[str, Any]) -> Dict[str, Any]:
        self.results = {"input": input_data}
        
        # Build dependency graph
        dependency_graph = self._build_dependency_graph(steps)
        
        # Execute steps in topological order
        for step_id in dependency_graph:
            step = next(s for s in steps if s.id == step_id)
            
            if step.parallel_execution:
                await self._execute_parallel(step)
            else:
                await self._execute_sequential(step)
        
        return self.results
    
    async def _execute_sequential(self, step: PipelineStep):
        # Wait for dependencies
        await self._wait_for_dependencies(step.dependencies)
        
        # Resolve prompt template
        resolved_prompt = self._resolve_template(step.prompt_template)
        
        # Execute with retry logic
        for attempt in range(step.retry_count):
            try:
                provider = self.providers[step.provider]
                result = await asyncio.wait_for(
                    provider.generate(resolved_prompt, step.model),
                    timeout=step.timeout_seconds
                )
                self.results[step.id] = result
                break
            except Exception as e:
                if attempt == step.retry_count - 1:
                    self.results[step.id] = {"error": str(e)}
                await asyncio.sleep(2 ** attempt)  # Exponential backoff

    def _resolve_template(self, template: str) -> str:
        # Replace {dependency.field} with actual values
        import re
        def replace_var(match):
            var_path = match.group(1)
            parts = var_path.split('.')
            value = self.results
            for part in parts:
                value = value.get(part, {})
            return str(value) if value else match.group(0)
        
        return re.sub(r'\{([^}]+)\}', replace_var, template)

# Usage Example
content_pipeline = AIPipeline()

steps = [
    PipelineStep(
        id="research",
        provider="anthropic",
        model="claude-3-opus-20240229",
        prompt_template="Research the topic: {input.topic}. Provide key insights and structure.",
        dependencies=[]
    ),
    PipelineStep(
        id="draft",
        provider="openai",
        model="gpt-4",
        prompt_template="Write a comprehensive article based on this research: {research.content}",
        dependencies=["research"]
    ),
    PipelineStep(
        id="images",
        provider="openai", 
        model="dall-e-3",
        prompt_template="Create 3 images for article: {draft.content}",
        dependencies=["draft"],
        parallel_execution=True
    ),
    PipelineStep(
        id="seo_optimize",
        provider="openai",
        model="gpt-3.5-turbo", 
        prompt_template="Optimize this article for SEO: {draft.content}",
        dependencies=["draft"],
        parallel_execution=True
    )
]

result = await content_pipeline.execute(steps, {"topic": "Future of AI in Web Development"})
```

**Estimated Duration:** 3 hours
- Multi-service architecture: 45 minutes
- Pipeline implementation: 120 minutes
- Testing and optimization: 15 minutes

---

### Lesson 5: Advanced UI/UX for AI Applications
**Duration:** 3 hours  
**Format:** Design and UX workshop with practical implementation

#### Learning Objectives
1. **Design intuitive interfaces** for complex AI interactions
2. **Handle AI uncertainty and ambiguity** in user experiences
3. **Create accessible AI applications** that work for all users
4. **Implement advanced loading and progress states** for AI operations
5. **Build responsive layouts** optimized for AI-generated content

#### Practical Exercise: Advanced AI Interface Design System
**Activity:** Create a comprehensive design system for AI applications

**Advanced Loading States and Animations:**
```tsx
// Sophisticated loading components
interface AILoadingProps {
  type: 'thinking' | 'generating' | 'processing' | 'streaming';
  progress?: number;
  message?: string;
  estimatedTime?: number;
}

export const AILoadingState: React.FC<AILoadingProps> = ({
  type,
  progress,
  message,
  estimatedTime
}) => {
  const animations = {
    thinking: "animate-pulse",
    generating: "animate-spin",
    processing: "animate-bounce",
    streaming: "animate-pulse"
  };

  const icons = {
    thinking: "🤔",
    generating: "✨", 
    processing: "⚙️",
    streaming: "📝"
  };

  const defaultMessages = {
    thinking: "AI is analyzing your request...",
    generating: "Creating your content...",
    processing: "Processing your data...",
    streaming: "Streaming response..."
  };

  return (
    <div className="ai-loading-container">
      <div className={`ai-loading-icon ${animations[type]}`}>
        <span className="text-4xl">{icons[type]}</span>
      </div>
      
      <div className="ai-loading-content">
        <p className="ai-loading-message">
          {message || defaultMessages[type]}
        </p>
        
        {progress !== undefined && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
            <span className="progress-text">{progress}%</span>
          </div>
        )}
        
        {estimatedTime && (
          <p className="estimated-time">
            Estimated time: {formatTime(estimatedTime)}
          </p>
        )}
      </div>
      
      <div className="ai-loading-dots">
        <span className="dot animate-bounce" style={{ animationDelay: '0s' }}>•</span>
        <span className="dot animate-bounce" style={{ animationDelay: '0.1s' }}>•</span>
        <span className="dot animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
      </div>
    </div>
  );
};

// Intelligent content display with fallbacks
interface AIContentDisplayProps {
  content: string;
  type: 'text' | 'code' | 'markdown' | 'json';
  streaming?: boolean;
  confidence?: number;
  sources?: Array<{ title: string; url: string; }>;
}

export const AIContentDisplay: React.FC<AIContentDisplayProps> = ({
  content,
  type,
  streaming = false,
  confidence,
  sources
}) => {
  const [displayContent, setDisplayContent] = useState('');
  
  // Streaming effect
  useEffect(() => {
    if (streaming) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayContent(content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20);
      
      return () => clearInterval(timer);
    } else {
      setDisplayContent(content);
    }
  }, [content, streaming]);

  const renderContent = () => {
    switch (type) {
      case 'markdown':
        return <ReactMarkdown>{displayContent}</ReactMarkdown>;
      case 'code':
        return (
          <SyntaxHighlighter language="javascript">
            {displayContent}
          </SyntaxHighlighter>
        );
      case 'json':
        return (
          <pre className="json-display">
            {JSON.stringify(JSON.parse(displayContent), null, 2)}
          </pre>
        );
      default:
        return <p className="whitespace-pre-wrap">{displayContent}</p>;
    }
  };

  return (
    <div className="ai-content-display">
      {confidence !== undefined && (
        <div className={`confidence-indicator ${getConfidenceColor(confidence)}`}>
          <span>Confidence: {Math.round(confidence * 100)}%</span>
          <div className="confidence-bar">
            <div 
              className="confidence-fill" 
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="content-wrapper">
        {renderContent()}
        {streaming && <span className="cursor animate-blink">|</span>}
      </div>
      
      {sources && sources.length > 0 && (
        <div className="sources-section">
          <h4>Sources:</h4>
          <ul>
            {sources.map((source, index) => (
              <li key={index}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="content-actions">
        <button className="copy-button" onClick={() => copyToClipboard(displayContent)}>
          📋 Copy
        </button>
        <button className="regenerate-button" onClick={() => /* regenerate logic */}>
          🔄 Regenerate
        </button>
      </div>
    </div>
  );
};
```

**Accessibility-First AI Components:**
```tsx
// Screen reader friendly AI interface
export const AccessibleAIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const announcements = useRef<HTMLDivElement>(null);

  const announceToScreenReader = (message: string) => {
    if (announcements.current) {
      announcements.current.textContent = message;
    }
  };

  const sendMessage = async (input: string) => {
    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    announceToScreenReader("Message sent, waiting for AI response");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      const aiMessage = { id: Date.now() + 1, role: 'assistant', content: data.message };
      
      setMessages(prev => [...prev, aiMessage]);
      announceToScreenReader("AI response received");
    } catch (error) {
      announceToScreenReader("Error occurred while getting AI response");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="accessible-ai-chat" role="main" aria-label="AI Chat Interface">
      {/* Screen reader announcements */}
      <div 
        ref={announcements}
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      />
      
      <div 
        className="messages-container" 
        role="log" 
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role}`}
            role="article"
            aria-label={`${message.role === 'user' ? 'Your' : 'AI'} message`}
          >
            <div className="message-header">
              <span className="role-indicator">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </span>
              <time dateTime={new Date(message.timestamp).toISOString()}>
                {formatTime(message.timestamp)}
              </time>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div 
            className="loading-message"
            role="status" 
            aria-label="AI is responding"
          >
            <AILoadingState type="thinking" message="AI is thinking..." />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('message') as HTMLInputElement;
          sendMessage(input.value);
          input.value = '';
        }}
        className="message-form"
      >
        <div className="input-container">
          <label htmlFor="message-input" className="sr-only">
            Type your message to the AI assistant
          </label>
          <input
            id="message-input"
            name="message"
            type="text"
            className="message-input"
            placeholder="Ask the AI anything..."
            disabled={isLoading}
            aria-describedby="input-help"
          />
          <div id="input-help" className="sr-only">
            Press Enter to send your message to the AI assistant
          </div>
        </div>
        
        <button
          type="submit"
          className="send-button"
          disabled={isLoading}
          aria-label="Send message"
        >
          <span aria-hidden="true">📤</span>
          <span className="sr-only">Send</span>
        </button>
      </form>
    </div>
  );
};
```

**Responsive AI Layout System:**
```scss
// Advanced CSS for AI interfaces
.ai-interface {
  display: grid;
  grid-template-areas: 
    "sidebar main"
    "sidebar footer";
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr auto;
  height: 100vh;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-areas: 
      "main"
      "footer";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .ai-sidebar {
    grid-area: sidebar;
    background: var(--sidebar-bg);
    border-radius: 8px;
    padding: 1rem;
    overflow-y: auto;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .ai-main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    min-height: 0; // Important for flexbox scrolling
  }

  .ai-footer {
    grid-area: footer;
    background: var(--footer-bg);
    padding: 1rem;
    border-radius: 8px;
  }
}

// AI-specific animations
@keyframes thinking {
  0%, 20% { opacity: 1; }
  50% { opacity: 0.5; }
  80%, 100% { opacity: 1; }
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

.ai-thinking {
  animation: thinking 2s ease-in-out infinite;
}

.ai-typewriter {
  overflow: hidden;
  border-right: 2px solid;
  white-space: nowrap;
  animation: typewriter 2s steps(20, end);
}

// Dark mode support for AI interfaces
@media (prefers-color-scheme: dark) {
  .ai-interface {
    --sidebar-bg: #1a1a1a;
    --footer-bg: #2d2d2d;
    --text-color: #ffffff;
    --ai-message-bg: #3a3a3a;
    --user-message-bg: #0066cc;
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .ai-interface {
    --border-width: 3px;
    --focus-outline: 4px solid yellow;
  }
  
  .message {
    border: var(--border-width) solid;
  }
  
  button:focus, input:focus {
    outline: var(--focus-outline);
  }
}
```

**Estimated Duration:** 3 hours
- Design system principles: 30 minutes
- Advanced component implementation: 120 minutes
- Accessibility testing: 30 minutes

---

### Lesson 6: Testing and Deployment Strategies
**Duration:** 3 hours  
**Format:** DevOps workshop with cloud deployment

#### Learning Objectives
1. **Implement comprehensive testing** for AI applications (unit, integration, E2E)
2. **Deploy applications** to multiple cloud platforms (Vercel, Netlify, AWS)
3. **Set up monitoring and observability** for AI application performance
4. **Implement CI/CD pipelines** with automated testing and deployment
5. **Configure environment management** for staging and production

#### Practical Exercise: Production-Ready AI Application Deployment
**Activity:** Take a working AI application through complete testing and deployment

**Comprehensive Testing Strategy:**
```typescript
// Jest tests for AI components
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIChat } from '../components/AIChat';
import { server } from '../mocks/server';

// Mock AI API responses
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AIChat Component', () => {
  test('should send message and display AI response', async () => {
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Ask the AI anything...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello, AI!' } });
    fireEvent.click(sendButton);
    
    // Check loading state
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    });
    
    // Verify message was added to chat history
    const messages = screen.getAllByRole('article');
    expect(messages).toHaveLength(2); // User + AI message
  });

  test('should handle API errors gracefully', async () => {
    // Mock API error
    server.use(
      rest.post('/api/chat', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'AI service unavailable' }));
      })
    );

    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Ask the AI anything...');
    fireEvent.change(input, { target: { value: 'Test error handling' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });

  test('should be accessible to screen readers', async () => {
    render(<AIChat />);
    
    // Check ARIA labels
    expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'AI Chat Interface');
    expect(screen.getByRole('log')).toHaveAttribute('aria-label', 'Chat messages');
    
    // Check form accessibility
    const input = screen.getByLabelText(/type your message/i);
    expect(input).toBeInTheDocument();
  });
});

// API route testing
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/chat';

describe('/api/chat', () => {
  test('should return AI response for valid input', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { message: 'Hello', sessionId: 'test-session' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('message');
    expect(data.message).toMatch(/hello/i);
  });

  test('should handle rate limiting', async () => {
    // Simulate multiple rapid requests
    const requests = Array(100).fill(null).map(() => createMocks({
      method: 'POST',
      body: { message: 'Rate limit test' },
    }));

    const responses = await Promise.all(
      requests.map(({ req, res }) => handler(req, res))
    );

    // Some requests should be rate limited
    const rateLimited = responses.filter(res => res._getStatusCode() === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});

// E2E testing with Playwright
import { test, expect } from '@playwright/test';

test.describe('AI Application E2E', () => {
  test('complete AI conversation flow', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for app to load
    await expect(page.locator('h1')).toContainText('AI Assistant');
    
    // Send a message
    await page.fill('[placeholder="Ask the AI anything..."]', 'What is machine learning?');
    await page.click('button[type="submit"]');
    
    // Verify loading state
    await expect(page.locator('.loading-indicator')).toBeVisible();
    
    // Wait for AI response
    await expect(page.locator('.ai-message')).toBeVisible({ timeout: 10000 });
    
    // Verify response content
    const aiResponse = await page.locator('.ai-message').textContent();
    expect(aiResponse).toMatch(/machine learning/i);
    
    // Test accessibility
    await expect(page.locator('[role="main"]')).toBeVisible();
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();
  });

  test('mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('http://localhost:3000');
    
    // Verify mobile layout
    await expect(page.locator('.mobile-nav')).toBeVisible();
    await expect(page.locator('.desktop-sidebar')).not.toBeVisible();
    
    // Test touch interactions
    await page.tap('[placeholder="Ask the AI anything..."]');
    await page.fill('[placeholder="Ask the AI anything..."]', 'Mobile test');
    await page.tap('button[type="submit"]');
    
    await expect(page.locator('.ai-message')).toBeVisible({ timeout: 10000 });
  });
});
```

**Docker and Container Setup:**
```dockerfile
# Multi-stage Dockerfile for AI app
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**CI/CD Pipeline Configuration:**
```yaml
# .github/workflows/deploy.yml
name: Deploy AI Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: ai_app_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ai_app_test
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY_TEST }}

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ai_app_test

      - name: Build application
        run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    
    steps:
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Deploy to AWS Lambda
        run: |
          npm install -g serverless
          serverless deploy --stage production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Monitoring and Observability:**
```typescript
// Application monitoring setup
import { Sentry } from '@sentry/nextjs';
import { Analytics } from '@vercel/analytics/react';

// Error tracking
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'https://your-ai-app.com'],
    }),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

// Custom metrics for AI usage
export const trackAIUsage = (model: string, tokens: number, cost: number) => {
  // Vercel Analytics
  Analytics.track('ai_request', {
    model,
    tokens,
    cost,
    timestamp: Date.now(),
  });

  // Custom metrics endpoint
  fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'ai_usage',
      model,
      tokens,
      cost,
      userId: getCurrentUserId(),
    }),
  });
};

// Performance monitoring
export const measureAIPerformance = async <T>(
  operation: string,
  aiFunction: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await aiFunction();
    const duration = performance.now() - startTime;
    
    trackAIUsage(operation, 0, 0); // Update with actual metrics
    
    // Log performance
    console.log(`AI operation ${operation} took ${duration}ms`);
    
    return result;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { operation, duration: performance.now() - startTime },
    });
    throw error;
  }
};
```

**Estimated Duration:** 3 hours
- Testing setup and implementation: 90 minutes
- Deployment configuration: 60 minutes
- Monitoring setup: 30 minutes

---

### Lesson 7: Capstone Project - Production AI Web Application
**Duration:** 3 hours  
**Format:** Individual project development with presentation

#### Learning Objectives
1. **Integrate all course concepts** into a comprehensive AI web application
2. **Implement production-ready features** including security, scalability, and monitoring
3. **Deploy to production** with proper DevOps practices
4. **Present technical work** professionally to stakeholders
5. **Plan future development** and maintenance strategies

#### Capstone Project Options

**Option A: AI-Powered Content Management System**
- **Core Features:** Automated content generation, SEO optimization, multi-language support
- **AI Components:** Content generation, image creation, translation, sentiment analysis
- **Technical Requirements:** Next.js, multiple AI providers, database integration, admin dashboard

**Option B: Intelligent Customer Service Platform**
- **Core Features:** Automated ticket routing, response suggestions, sentiment tracking
- **AI Components:** NLP classification, sentiment analysis, chatbot integration
- **Technical Requirements:** Real-time chat, database integration, analytics dashboard

**Option C: AI Development Tools Suite**
- **Core Features:** Code generation, documentation automation, testing assistance
- **AI Components:** Code generation, technical documentation, test case creation
- **Technical Requirements:** IDE integration, GitHub API, syntax highlighting

**Option D: Personalized Learning Platform**
- **Core Features:** Adaptive content creation, progress tracking, personalized recommendations
- **AI Components:** Content generation, difficulty assessment, learning path optimization
- **Technical Requirements:** User management, progress tracking, interactive content

#### Development Process (3 hours)

**Phase 1: Project Planning and Setup (30 minutes)**
```typescript
// Project structure template
ai-capstone-project/
├── frontend/
│   ├── components/
│   │   ├── ai/
│   │   ├── ui/
│   │   └── layout/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   └── styles/
├── backend/
│   ├── api/
│   ├── services/
│   ├── models/
│   └── middleware/
├── tests/
│   ├── components/
│   ├── api/
│   └── e2e/
├── docs/
└── deployment/
    ├── docker/
    ├── k8s/
    └── terraform/
```

**Phase 2: Core Development (120 minutes)**
Students work individually with periodic check-ins:

**30-minute intervals:**
1. **Setup and basic structure** - Project initialization, basic routing, AI service setup
2. **Core AI integration** - Primary AI features implementation
3. **User interface development** - Complete UI with responsive design
4. **Testing and optimization** - Unit tests, performance optimization

**Phase 3: Deployment and Presentation (30 minutes)**
- Production deployment
- Final testing and bug fixes
- Presentation preparation
- Live demonstrations

#### Advanced Project Requirements

**Technical Excellence Standards:**
```typescript
// Example of production-ready code quality
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { validateRequest } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { trackMetrics } from '../services/analytics';

// Input validation schema
const AIRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus']),
  maxTokens: z.number().int().min(1).max(4000).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

// Rate limiting
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many AI requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Production API endpoint
export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    // Authentication
    const user = await authenticate(request);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Rate limiting
    await aiRateLimit(request);

    // Input validation
    const body = await request.json();
    const validatedData = AIRequestSchema.parse(body);

    // Check user quota
    const usage = await getUserUsage(user.id);
    if (usage.monthlyTokens > usage.limit) {
      return new Response('Usage limit exceeded', { status: 429 });
    }

    // AI processing
    const result = await processAIRequest(validatedData, user.id);
    
    // Track metrics
    await trackMetrics({
      userId: user.id,
      operation: 'ai_request',
      model: validatedData.model,
      tokens: result.usage.totalTokens,
      latency: Date.now() - startTime,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI request failed:', error);
    
    // Error tracking
    await trackError(error, { userId: user?.id, endpoint: 'ai_request' });
    
    return new Response('Internal server error', { status: 500 });
  }
}
```

**Security Implementation:**
```typescript
// Security middleware and practices
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
}));

// API key security
const validateAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || !isValidAPIKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Input sanitization
const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
};
```

**Estimated Duration:** 3 hours
- Planning and setup: 30 minutes
- Core development: 120 minutes
- Deployment and presentation: 30 minutes

---

## 📊 Assessment and Evaluation

### Comprehensive Assessment Framework

**Continuous Assessment (60%)**
- **Technical Implementation** (25%)
  - Code quality and architecture
  - AI integration effectiveness
  - Security and best practices
  - Performance optimization

- **User Interface and Experience** (20%)
  - Design quality and usability
  - Accessibility compliance
  - Responsive design implementation
  - Loading states and error handling

- **Project Participation** (15%)
  - Active engagement in lessons
  - Quality of peer collaboration
  - Problem-solving approach
  - Help provided to classmates

### Final Project Assessment (40%)

**Technical Excellence (20%)**
- Clean, well-documented code
- Proper error handling and security
- Effective use of multiple AI services
- Production deployment success

**Innovation and Problem-Solving (10%)**
- Creative approach to challenges
- Original features and implementations
- Effective problem-solving strategies
- Technical decision reasoning

**Professional Presentation (10%)**
- Clear project demonstration
- Technical architecture explanation
- Future development planning
- Question handling and discussion

### Detailed Grading Rubrics

**Capstone Project Scoring:**
- **Exceptional (95-100%):** Production-ready application with innovative features, excellent code quality, comprehensive testing, and flawless presentation
- **Excellent (85-94%):** High-quality application with good architecture, solid AI integration, adequate testing, and professional presentation
- **Good (75-84%):** Functional application meeting requirements, decent code quality, basic testing, clear presentation
- **Satisfactory (65-74%):** Basic application with some issues, minimal testing, adequate presentation
- **Needs Improvement (<65%):** Incomplete or non-functional application, poor code quality, inadequate presentation

---

## 🛠️ Technical Stack and Tools

### Frontend Technologies
- **Framework:** Next.js 14+ with App Router
- **UI Library:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom design system
- **State Management:** Zustand or Redux Toolkit
- **Animation:** Framer Motion for AI interactions
- **Testing:** Jest, React Testing Library, Playwright

### Backend Technologies
- **API Framework:** Next.js API routes or FastAPI
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js or Auth0
- **Caching:** Redis for session and API response caching
- **Queue System:** Bull/BullMQ for background processing
- **File Storage:** AWS S3 or Vercel Blob

### AI Services and Integration
- **Primary Providers:** OpenAI, Anthropic, Google AI
- **Orchestration:** LangChain for complex workflows
- **Vector Database:** Pinecone or Supabase Vector
- **Image Processing:** OpenAI DALL-E, Stable Diffusion
- **Speech:** Whisper for transcription, ElevenLabs for TTS

### DevOps and Deployment
- **Hosting:** Vercel, Netlify, or AWS
- **Containerization:** Docker with multi-stage builds
- **CI/CD:** GitHub Actions or GitLab CI
- **Monitoring:** Sentry, Vercel Analytics, Custom dashboards
- **Security:** Helmet.js, CORS, rate limiting

---

## 📚 Learning Resources and Career Support

### Technical Documentation
- **Next.js:** Official documentation and examples
- **AI APIs:** OpenAI Cookbook, Anthropic docs, Google AI guides
- **Testing:** Jest documentation, Playwright guides
- **Deployment:** Vercel docs, AWS deployment guides

### Professional Development
- **Portfolio Building:** GitHub profile optimization, project documentation
- **Job Search:** Resume review, interview preparation, networking guidance
- **Continued Learning:** Advanced AI courses, specialization tracks
- **Community:** Alumni network, open source contributions

### Industry Connections
- **Guest Speakers:** AI engineers from major tech companies
- **Mentorship:** Pairing with industry professionals
- **Internships:** Connections to AI-focused companies
- **Freelance Opportunities:** Platform recommendations and client acquisition strategies

---

## 📈 Success Metrics and Outcomes

### Technical Competency Verification
**Students demonstrate mastery by:**
- Building full-stack applications with multiple AI integrations
- Implementing real-time features with WebSocket connections
- Deploying production-ready applications with proper security
- Writing comprehensive tests for AI functionality
- Creating accessible, responsive user interfaces

### Career Impact Goals
- **Portfolio Quality:** 100% have deployable applications for job applications
- **Technical Interviews:** 90% report increased confidence in technical discussions
- **Job Placement:** 80% receive offers or promotions within 6 months
- **Salary Impact:** Average 25-40% increase for web developers transitioning to AI roles
- **Industry Recognition:** Projects featured in tech blogs and conference presentations

### Long-Term Professional Success
- **Leadership Roles:** Graduates become AI development team leads
- **Consulting Success:** 15% start successful AI consulting practices
- **Open Source:** Active contributors to AI development tools and frameworks
- **Speaking Engagements:** Present at conferences and meetups about AI web development

---

*This advanced web development course transforms experienced developers into AI application specialists, providing the technical skills and industry knowledge needed to build production-scale intelligent web applications.*