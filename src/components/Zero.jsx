import React from 'react'
import { motion } from 'framer-motion'

const Zero = () => {
  return (
    <div>
          <section className="h-screen flex items-center justify-center bg-[#e72132] p-4 sm:p-6 relative z-20">
        <motion.div 
        //   initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="w-full max-w-6xl border-4 sm:border-8 border-black bg-white p-8 sm:p-16 md:p-24 lg:p-32 text-center shadow-[20px_20px_0px_0px_#000] sm:shadow-[30px_30px_0px_0px_#000] md:shadow-[40px_40px_0px_0px_#000]"
        >
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[11rem] font-[1000] text-black uppercase leading-[0.7] mb-8 sm:mb-12 tracking-tighter">
            ZERO.<br/>LIMITS.
          </h2>
          {/* <motion.button 
            whileHover={{ scale: 1.05, x: 10, y: -10 }}
            className="bg-black text-white px-20 py-8 text-3xl font-black uppercase shadow-[10px_10px_0px_0px_#EF6925]"
          >
            Deploy System
          </motion.button> */}
        </motion.div>
      </section>
    </div>
  )
}

export default Zero