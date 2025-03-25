import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background avec effet de parallaxe */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-indigo-800 to-purple-900">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0px 0px', '100px 50px'],
          }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "mirror", 
            duration: 20, 
            ease: "linear" 
          }}
          style={{
            backgroundImage: 'url("/images/pattern-dots.svg")',
            backgroundSize: '30px'
          }}
        />
      </div>

      {/* Formes décoratives animées */}
      <motion.div 
        className="absolute top-20 right-[20%] w-96 h-96 rounded-full bg-purple-500/20 filter blur-[80px] z-0"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-10 left-[30%] w-80 h-80 rounded-full bg-blue-500/20 filter blur-[80px] z-0"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute top-1/3 left-[15%] w-72 h-72 rounded-full bg-fuchsia-500/20 filter blur-[90px] z-0"
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Contenu */}
      <div className="container mx-auto px-4 py-32 md:py-40 lg:py-48 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20 shadow-lg"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                À propos d'EventEz
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Nous réinventons <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">l'organisation d'événements</span> au Cameroun
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans l'organisation de vos événements.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Button href="/register-organizer" className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-medium shadow-lg">
                    Rejoindre EventEz
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Button href="#notre-histoire" variant="outline" className="border-2 border-white/80 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-medium backdrop-blur-sm">
                    Notre histoire
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Illustration/statistiques côté droit */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 overflow-hidden shadow-xl">
                {/* Formes décoratives sur la carte */}
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-white text-2xl font-bold mb-8">Chiffres clés</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div 
                      className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <p className="text-violet-200 text-sm mb-1">Événements organisés</p>
                      <p className="text-white text-3xl font-bold">10,000+</p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <p className="text-violet-200 text-sm mb-1">Participants</p>
                      <p className="text-white text-3xl font-bold">500,000+</p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <p className="text-violet-200 text-sm mb-1">Partenaires</p>
                      <p className="text-white text-3xl font-bold">250+</p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <p className="text-violet-200 text-sm mb-1">Satisfaction client</p>
                      <p className="text-white text-3xl font-bold">98%</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Forme décorative en bas */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20">
          <path fill="white" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path fill="white" d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path fill="white" d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
}