import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react'

interface ArrayVisualizerProps {}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = () => {
  const [array, setArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19])
  const [leftPointer, setLeftPointer] = useState(0)
  const [rightPointer, setRightPointer] = useState(9)
  const [target, setTarget] = useState(20)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSteps, setAnimationSteps] = useState<Array<{left: number, right: number, sum: number, action: string}>>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [foundPair, setFoundPair] = useState<{left: number, right: number} | null>(null)

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({length: 10}, () => Math.floor(Math.random() * 50) + 1).sort((a, b) => a - b)
    setArray(newArray)
    setLeftPointer(0)
    setRightPointer(newArray.length - 1)
    setFoundPair(null)
    setAnimationSteps([])
    setCurrentStep(0)
  }, [])

  const twoPointersSolution = useCallback(async () => {
    const steps: Array<{left: number, right: number, sum: number, action: string}> = []
    let left = 0
    let right = array.length - 1
    
    while (left < right) {
      const sum = array[left] + array[right]
      steps.push({ left, right, sum, action: `Checking ${array[left]} + ${array[right]} = ${sum}` })
      
      if (sum === target) {
        steps.push({ left, right, sum, action: `Found pair! ${array[left]} + ${array[right]} = ${target}` })
        break
      } else if (sum < target) {
        steps.push({ left, right, sum, action: `${sum} < ${target}, move left pointer right` })
        left++
      } else {
        steps.push({ left, right, sum, action: `${sum} > ${target}, move right pointer left` })
        right--
      }
    }
    
    if (left >= right && steps[steps.length - 1].sum !== target) {
      steps.push({ left, right, sum: 0, action: 'No pair found that sums to target' })
    }
    
    setAnimationSteps(steps)
    setCurrentStep(0)
    animateSteps(steps)
  }, [array, target])

  const animateSteps = async (steps: Array<{left: number, right: number, sum: number, action: string}>) => {
    setIsAnimating(true)
    setFoundPair(null)
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      setLeftPointer(step.left)
      setRightPointer(step.right)
      setCurrentStep(i)
      
      if (step.sum === target && step.action.includes('Found pair!')) {
        setFoundPair({left: step.left, right: step.right})
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    setIsAnimating(false)
  }

  const reset = () => {
    setLeftPointer(0)
    setRightPointer(array.length - 1)
    setFoundPair(null)
    setAnimationSteps([])
    setCurrentStep(0)
    setIsAnimating(false)
  }

  const currentSum = array[leftPointer] + array[rightPointer]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">🎯 Two Pointers Array Visualizer</h2>
        <p className="text-blue-200">
          Interactive visualization of the two pointers technique for finding pairs
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-white font-semibold">Target Sum:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
            disabled={isAnimating}
          />
        </div>
        
        <button
          onClick={twoPointersSolution}
          disabled={isAnimating}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          <span>Start Algorithm</span>
        </button>
        
        <button
          onClick={reset}
          disabled={isAnimating}
          className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
        
        <button
          onClick={generateRandomArray}
          disabled={isAnimating}
          className="flex items-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
        >
          <span>Random Array</span>
        </button>
      </div>

      {/* Array Visualization */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <div className="flex justify-center items-end space-x-2 mb-8">
          {array.map((value, index) => {
            const isLeftPointer = index === leftPointer
            const isRightPointer = index === rightPointer
            const isInPair = foundPair && (index === foundPair.left || index === foundPair.right)
            
            return (
              <div key={index} className="flex flex-col items-center">
                {/* Pointer indicators */}
                <div className="h-8 flex flex-col justify-end">
                  {isLeftPointer && (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-blue-500 font-bold text-lg"
                    >
                      ↑ L
                    </motion.div>
                  )}
                  {isRightPointer && (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
                      className="text-red-500 font-bold text-lg"
                    >
                      ↑ R
                    </motion.div>
                  )}
                </div>
                
                {/* Array element */}
                <motion.div
                  animate={isInPair ? { scale: [1, 1.2, 1], backgroundColor: '#10B981' } : {}}
                  className={`
                    w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg border-2 transition-all
                    ${isLeftPointer || isRightPointer
                      ? 'bg-yellow-500 text-black border-yellow-300 shadow-lg'
                      : isInPair
                        ? 'bg-green-500 text-white border-green-300'
                        : 'bg-white text-gray-800 border-gray-300'
                    }
                  `}
                  style={{ height: `${Math.max(60, value * 2)}px` }}
                >
                  {value}
                </motion.div>
                
                {/* Index */}
                <div className="text-blue-300 text-sm mt-2 font-semibold">
                  {index}
                </div>
              </div>
            )
          })}
        </div>

        {/* Current sum display */}
        <div className="text-center">
          <div className={`
            inline-block px-6 py-3 rounded-lg font-bold text-xl
            ${currentSum === target
              ? 'bg-green-500 text-white'
              : currentSum < target
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
            }
          `}>
            {array[leftPointer]} + {array[rightPointer]} = {currentSum}
            {currentSum === target && ' 🎉 FOUND!'}
          </div>
        </div>
      </div>

      {/* Algorithm Steps */}
      {animationSteps.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">🔍 Current Step</h3>
            {animationSteps[currentStep] && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-blue-200"
              >
                <div className="font-semibold text-lg mb-2">
                  Step {currentStep + 1} of {animationSteps.length}
                </div>
                <div className="text-white">
                  {animationSteps[currentStep].action}
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">📊 Algorithm Info</h3>
            <div className="space-y-2 text-blue-200">
              <div><strong>Time Complexity:</strong> O(n)</div>
              <div><strong>Space Complexity:</strong> O(1)</div>
              <div><strong>Target Sum:</strong> {target}</div>
              <div><strong>Array Length:</strong> {array.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Code Implementation */}
      <div className="bg-gray-900 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">💻 Two Pointers Implementation</h3>
        <pre className="text-green-400 text-sm overflow-x-auto">
{`function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right]; // Found pair!
    } else if (sum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }
  
  return []; // No pair found
}`}
        </pre>
      </div>

      {/* Interactive Manual Control */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">🎮 Manual Control</h3>
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold">Left Pointer:</span>
            <button
              onClick={() => setLeftPointer(Math.max(0, leftPointer - 1))}
              disabled={isAnimating || leftPointer <= 0}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-white font-mono bg-white/10 px-3 py-1 rounded">
              {leftPointer}
            </span>
            <button
              onClick={() => setLeftPointer(Math.min(array.length - 1, leftPointer + 1))}
              disabled={isAnimating || leftPointer >= rightPointer}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold">Right Pointer:</span>
            <button
              onClick={() => setRightPointer(Math.max(0, rightPointer - 1))}
              disabled={isAnimating || rightPointer <= leftPointer}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-white font-mono bg-white/10 px-3 py-1 rounded">
              {rightPointer}
            </span>
            <button
              onClick={() => setRightPointer(Math.min(array.length - 1, rightPointer + 1))}
              disabled={isAnimating || rightPointer >= array.length - 1}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArrayVisualizer
