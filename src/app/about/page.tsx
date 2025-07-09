'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Script from "next/script";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateOrganizationStructuredData, EVENT_CONFIG, ABOUT_PAGE_DATA } from "@/lib";

export default function About() {
  const organizationData = generateOrganizationStructuredData();
  
  const { values, differentiators, anitsAdvantage, communityImpact } = ABOUT_PAGE_DATA;

  return (
    <>
      <Script
        id="about-organization-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <div className="text-spacing-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  About {EVENT_CONFIG.name}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                More than a tech summit — we&apos;re building the future of innovation through
                <span className="text-blue-400"> collaboration</span>,
                <span className="text-violet-400"> creativity</span>, and
                <span className="text-pink-400"> community</span>.
              </p>
            </div>
          </motion.div>

          {/* Mission, Vision, Community */}
          <div className="grid md:grid-cols-3 grid-gap mb-12 sm:mb-16 lg:mb-20">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                  <CardContent className="card-padding">
                    <div className="card-gap flex flex-col">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <value.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{value.title}</h3>
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="section-padding bg-gray-800/20">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="text-spacing-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                What Makes Samyukta <span className="text-blue-400">Different</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                We&apos;re not just another tech event — we&apos;re creating a movement that transforms how students, industry, and institutions collaborate.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 grid-gap mb-12 sm:mb-16 lg:mb-20">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <CardContent className="card-padding">
                    <div className="card-gap flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
                          <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <Badge className="text-xs sm:text-sm font-bold text-blue-400 bg-blue-400/10 border-blue-400/20">
                          {item.stats}
                        </Badge>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-sm sm:text-base text-gray-400">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The ANITS Advantage */}
      <section className="section-padding section-margin">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 grid-gap-lg items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-spacing-lg">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  The <span className="text-violet-400">ANITS</span> Advantage
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {anitsAdvantage.points.map((point, index) => (
                    <div key={point.title} className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-400' : index === 1 ? 'bg-violet-400' : 'bg-pink-400'} mt-2 sm:mt-3 flex-shrink-0`}></div>
                      <div className="text-spacing">
                        <h3 className="text-base sm:text-lg font-semibold text-white">{point.title}</h3>
                        <p className="text-sm sm:text-base text-gray-400">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border-gray-700">
                <CardContent className="card-padding">
                  <div className="card-gap flex flex-col">
                    <Image
                      src="/anits-campus.png"
                      alt="ANITS Campus"
                      width={800}
                      height={600}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl"
                    />
                    <h3 className="text-lg sm:text-xl font-bold text-white">{anitsAdvantage.campus.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400">
                      {anitsAdvantage.campus.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="section-padding bg-gradient-to-r from-blue-600/10 to-violet-600/10">
        <div className="container-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-spacing-lg mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {communityImpact.title.split('Tech Leaders')[0]}<span className="text-pink-400">Tech Leaders</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto">
                {communityImpact.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 grid-gap">
              {communityImpact.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/40 backdrop-blur-sm border-gray-700"
                >
                  <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
                    <CardContent className="card-padding">
                      <div className="text-spacing text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">{stat.number}</div>
                        <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}