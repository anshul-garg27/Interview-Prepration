'use client'

import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({ 
  code, 
  language = 'javascript', 
  title, 
  showLineNumbers = true,
  className = '' 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript': return 'from-yellow-500 to-orange-500'
      case 'python': return 'from-blue-500 to-green-500'
      case 'java': return 'from-red-500 to-orange-600'
      case 'cpp': case 'c++': return 'from-purple-500 to-pink-500'
      case 'go': return 'from-cyan-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }
  
  const getLanguageIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript': return '⚡'
      case 'python': return '🐍'
      case 'java': return '☕'
      case 'cpp': case 'c++': return '⚙️'
      case 'go': return '🐹'
      default: return '💻'
    }
  }
  
  const getSyntaxLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'cpp': case 'c++': return 'cpp'
      default: return lang.toLowerCase()
    }
  }
  // Custom theme based on VS Code Dark+
  const customTheme = {
    ...vscDarkPlus,
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: 'transparent',
      margin: 0,
      padding: 0,
      overflow: 'visible',
    }
  }
  
  const lines = code.split('\n')

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Window Controls */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
            </div>
            
            {/* Language Badge */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getLanguageColor(language)} shadow-lg`}>
              <span>{getLanguageIcon(language)}</span>
              <span>{language.toUpperCase()}</span>
            </div>
            
            {/* Title */}
            {title && (
              <span className="text-gray-300 font-medium">{title}</span>
            )}
          </div>
          
          {/* Copy Button */}
          <motion.button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all text-sm shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Code Content with Professional Syntax Highlighting */}
      <div className="relative">
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className="bg-gray-800/50 px-4 py-4 border-r border-gray-700/50 select-none">
              {lines.map((_, index) => (
                <div key={index} className="text-gray-500 text-sm font-mono leading-6 text-right">
                  {(index + 1).toString().padStart(2, ' ')}
                </div>
              ))}
            </div>
          )}
          
          {/* Code */}
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language={getSyntaxLanguage(language)}
              style={vscDarkPlus}
              showLineNumbers={false}
              wrapLines={true}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                }
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
        {/* Gradient Overlay for Scroll Hint */}
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none opacity-50"></div>

      </div>
      {/* Footer with Code Stats */}
      <div className="bg-gray-800/50 px-6 py-2 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{lines.length} lines</span>
          <span>{code.length} characters</span>
        </div>
      </div>
    </div>
  )
}
