
import React, { useState, useCallback, useEffect } from 'react';
import { CalculationHistory, Mode } from './types';
import CalculatorButton from './components/CalculatorButton';
import { explainMathProblem } from './services/geminiService';

const App: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [mode, setMode] = useState<Mode>(Mode.STANDARD);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    setDisplay(prev => prev === '0' ? digit : prev + digit);
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = useCallback(() => {
    try {
      const fullExpression = expression + display;
      // Using direct eval for simplicity in this context, but with caution. 
      // Replace with a math parser for production.
      const sanitized = fullExpression.replace(/[^-()\d/*+.]/g, '');
      const result = eval(sanitized).toString();
      
      setHistory(prev => [{
        expression: fullExpression,
        result: result,
        timestamp: new Date()
      }, ...prev].slice(0, 10));

      setDisplay(result);
      setExpression('');
    } catch (error) {
      setDisplay('خطأ');
    }
  }, [display, expression]);

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const askAI = async () => {
    const query = expression ? `${expression} ${display}` : display;
    if (query === '0' || query === '') return;
    
    setAiLoading(true);
    setMode(Mode.AI);
    const explanation = await explainMathProblem(query);
    setAiExplanation(explanation);
    setAiLoading(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          حاسبة ذكية
        </h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
        
        {/* Mode Selector */}
        <div className="flex p-2 bg-slate-100 dark:bg-slate-900/50">
          <button 
            onClick={() => setMode(Mode.STANDARD)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${mode === Mode.STANDARD ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
          >
            قياسية
          </button>
          <button 
            onClick={() => setMode(Mode.SCIENTIFIC)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${mode === Mode.SCIENTIFIC ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
          >
            علمية
          </button>
          <button 
            onClick={() => setMode(Mode.AI)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${mode === Mode.AI ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-500'}`}
          >
            ذكاء اصطناعي ✨
          </button>
        </div>

        {/* Display Section */}
        <div className="p-8 text-right flex flex-col justify-end min-h-[160px] bg-white dark:bg-slate-800">
          <div className="text-slate-400 dark:text-slate-500 text-lg mb-1 h-6 overflow-hidden whitespace-nowrap">
            {expression}
          </div>
          <div className="text-5xl font-bold truncate tracking-tight dark:text-white">
            {display}
          </div>
        </div>

        {/* Calculator Body */}
        {mode !== Mode.AI ? (
          <div className="p-6 grid grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/30">
            <CalculatorButton label="C" variant="action" onClick={clear} />
            <CalculatorButton label="÷" variant="operator" onClick={() => handleOperator('/')} />
            <CalculatorButton label="×" variant="operator" onClick={() => handleOperator('*')} />
            <CalculatorButton label="⌫" variant="action" onClick={() => setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0')} />
            
            <CalculatorButton label="7" onClick={() => handleDigit('7')} />
            <CalculatorButton label="8" onClick={() => handleDigit('8')} />
            <CalculatorButton label="9" onClick={() => handleDigit('9')} />
            <CalculatorButton label="-" variant="operator" onClick={() => handleOperator('-')} />
            
            <CalculatorButton label="4" onClick={() => handleDigit('4')} />
            <CalculatorButton label="5" onClick={() => handleDigit('5')} />
            <CalculatorButton label="6" onClick={() => handleDigit('6')} />
            <CalculatorButton label="+" variant="operator" onClick={() => handleOperator('+')} />
            
            <CalculatorButton label="1" onClick={() => handleDigit('1')} />
            <CalculatorButton label="2" onClick={() => handleDigit('2')} />
            <CalculatorButton label="3" onClick={() => handleDigit('3')} />
            <CalculatorButton label="=" variant="special" className="row-span-2 h-full" onClick={calculate} />
            
            <CalculatorButton label="0" className="col-span-2" onClick={() => handleDigit('0')} />
            <CalculatorButton label="." onClick={() => handleDigit('.')} />
          </div>
        ) : (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/30 min-h-[400px]">
            <div className="flex flex-col gap-4">
              <button 
                onClick={askAI}
                disabled={aiLoading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {aiLoading ? 'جاري التحليل...' : 'اطلب شرحاً من الذكاء الاصطناعي'}
              </button>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[250px] overflow-y-auto">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-50">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm">Gemini يفكر...</p>
                  </div>
                ) : aiExplanation ? (
                  <div className="prose prose-sm dark:prose-invert">
                    <p className="leading-relaxed whitespace-pre-wrap">{aiExplanation}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-4">
                    <p>قم بكتابة عملية حسابية ثم اضغط على الزر أعلاه للحصول على شرح مفصل.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="w-full max-w-md mt-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>🕒 السجل الأخير</span>
          <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">آخر 10 عمليات</span>
        </h3>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-center text-slate-400 py-8 italic">لا يوجد سجل عمليات بعد</p>
          ) : (
            history.map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setDisplay(item.result)}
              >
                <div className="text-left">
                  <span className="text-xs text-slate-400 block mb-1">
                    {item.timestamp.toLocaleTimeString('ar-SA')}
                  </span>
                  <span className="text-slate-500 text-sm">{item.expression}</span>
                </div>
                <div className="text-xl font-bold text-indigo-500">= {item.result}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-400 text-sm">
        صنع بكل حب باستخدام <span className="text-indigo-500">React</span> و <span className="text-purple-500">Gemini AI</span>
      </footer>
    </div>
  );
};

export default App;
