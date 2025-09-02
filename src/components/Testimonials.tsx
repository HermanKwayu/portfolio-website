import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Testimonials() {
  const testimonials = [
    {
      quote: "The strategic insights and implementation support we received was exceptional. Our operational efficiency improved by 35% within the first quarter.",
      author: "Sarah Chen",
      role: "CEO",
      company: "TechVision Inc.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b142?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "A true strategic partner who understands both the big picture and the details needed for execution. The results speak for themselves.",
      author: "Michael Rodriguez",
      role: "Operations Director",
      company: "Global Manufacturing Co.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "The digital transformation roadmap was exactly what we needed. Clear, actionable, and delivered measurable results ahead of schedule.",
      author: "Emily Watson",
      role: "CTO",
      company: "FinanceForward",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "Outstanding analytical skills combined with practical implementation experience. Helped us scale our operations seamlessly.",
      author: "David Kim",
      role: "Founder",
      company: "StartupSuccess",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "The change management approach was thoughtful and effective. Our team embraced the new processes with minimal resistance.",
      author: "Lisa Thompson",
      role: "HR Director",
      company: "Enterprise Solutions",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      quote: "Delivered exactly what was promised, on time and within budget. The ROI exceeded our expectations by 200%.",
      author: "James Wilson",
      role: "VP Strategy",
      company: "RetailChain Plus",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Client Success Stories</h2>
          <p className="text-lg text-muted-foreground">
            Don't just take my word for it. Here's what clients say about the impact 
            of our collaboration on their business transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-muted-foreground flex-grow mb-6">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center space-x-3 mt-auto">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">$10M+</div>
              <div className="text-sm text-muted-foreground">Client Value Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}