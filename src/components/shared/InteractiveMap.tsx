'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Navigation,
  Car,
  Clock,
  Phone,
  ExternalLink,
  Share2,
  Copy
} from 'lucide-react';
import { MapLocation } from '@/lib/types';
import { useNavigation } from '@/hooks/useClientSide';

export default function InteractiveMap() {
  const [selectedLocation] = useState<MapLocation | null>(null);

  const { getCurrentURL } = useNavigation();

  const openInGoogleMaps = (location: MapLocation) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const getDirections = (location: MapLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const copyCoordinates = async (location: MapLocation) => {
    const coords = `${location.coordinates.lat},${location.coordinates.lng}`;
    await navigator.clipboard.writeText(coords);
  };

  const shareLocation = async (location: MapLocation) => {
    if (navigator.share) {
      const currentUrl = getCurrentURL();
      await navigator.share({
        title: location.name,
        text: location.description,
        url: currentUrl
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/50 bg-gray-800/50 text-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-400" />
            ANITS Campus Location
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7592.443334625539!2d83.4204202713302!3d17.921812148981132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39581b73ffffff%3A0xd04b9046faa4565f!2sAnil%20Neerukonda%20Institute%20of%20Technology%20and%20Sciences%20(ANITS)!5e0!3m2!1sen!2sin!4v1751912202967!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-b-lg"
            />

            <div className="absolute top-4 right-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => window.open('https://maps.google.com/?q=ANITS+Visakhapatnam', '_blank')}
                className="backdrop-blur-sm shadow-lg"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open in Maps
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedLocation.color} flex items-center justify-center shrink-0`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedLocation.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {selectedLocation.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{selectedLocation.description}</p>

                  {selectedLocation.distance && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        <span>{selectedLocation.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedLocation.estimatedTime}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => getDirections(selectedLocation)}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInGoogleMaps(selectedLocation)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open('tel:+919876543210', '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call for Information
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => shareLocation(selectedLocation)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Location
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => copyCoordinates(selectedLocation)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Coordinates
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}


    </div>
  );
}
