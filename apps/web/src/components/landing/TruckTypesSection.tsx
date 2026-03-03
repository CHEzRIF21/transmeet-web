import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Truck, Package, Box, Container } from "lucide-react";

const TRUCK_TYPES = [
  { name: "Plateau", icon: Truck, color: "bg-primary" },
  { name: "Citerne", icon: Container, color: "bg-primary/80" },
  { name: "Frigo", icon: Box, color: "bg-accent" },
  { name: "Benne", icon: Truck, color: "bg-primary/70" },
  { name: "Conteneur", icon: Container, color: "bg-primary/90" },
  { name: "Bâché", icon: Package, color: "bg-accent/80" },
];

export function TruckTypesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Nous avons forcément le camion dont vous avez besoin
          </h2>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {TRUCK_TYPES.map((item) => (
            <Card
              key={item.name}
              className="border-primary/10 bg-card transition-shadow hover:shadow-md flex flex-col items-center"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Avatar className="h-14 w-14 mb-2">
                  <AvatarFallback className={`${item.color} text-white`}>
                    <item.icon className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold text-foreground">
                  {item.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
