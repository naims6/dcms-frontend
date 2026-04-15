"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export function ContactSection() {
  const t = useTranslations("ContactSection");

  return (
    <section className="w-full py-16 md:py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {t("subtitle")}
          </p>
          <div className="w-16 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info (Left Column) */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {t("infoTitle")}
              </h3>
              <p className="text-muted-foreground">{t("infoDesc")}</p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-xl text-primary mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {t("addressTitle")}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mt-1">
                    {t("addressText")}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-xl text-primary mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {t("phoneTitle")}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mt-1 font-medium">
                    {t("phoneText")}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-xl text-primary mt-1">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    {t("emailTitle")}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mt-1 font-medium">
                    {t("emailText")}
                  </p>
                </div>
              </div>
            </div>

            {/* Optional: Add a map embed underneath or keep it clean without one */}
            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-sm border border-border/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14512.441113063853!2d89.9419139!3d24.6724647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdf7185ccbe6ef%3A0xcfd6dc32ce310aa4!2sDhanbari!5e0!3m2!1sen!2sbd!4v1714456942000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="bg-card border border-border shadow-md rounded-2xl p-6 sm:p-8 md:p-10 h-full flex flex-col">
            <form
              className="space-y-6 h-full flex flex-col"
              onSubmit={(e) => {
                e.preventDefault(); /* form logic */
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    {t("formName")}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("formName")}
                    className="h-12 bg-background border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    {t("formEmail")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("formEmail")}
                    className="h-12 bg-background border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-semibold text-foreground"
                >
                  {t("formSubject")}
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder={t("formSubject")}
                  className="h-12 bg-background border-border/50"
                />
              </div>

              <div className="space-y-2 flex flex-col flex-1">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-foreground mb-2"
                >
                  {t("formMessage")}
                </label>
                <textarea
                  id="message"
                  rows={8}
                  placeholder={t("formMessage")}
                  className="flex-1 min-h-[200px] w-full rounded-md border border-input bg-background border-border/50 px-3 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold group rounded-xl mt-auto"
              >
                {t("formSubmit")}
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
