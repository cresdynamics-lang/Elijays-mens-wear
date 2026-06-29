import { parseDescriptionSections } from '../../utils/productDescription';

const Section = ({ title, icon, children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <h3 className="text-[10px] font-bold tracking-[0.22em] text-accent flex items-center gap-2.5 uppercase">
      {icon && <span aria-hidden className="text-accent/70">{icon}</span>}
      {title}
    </h3>
    {children}
  </div>
);

const Callout = ({ children }) => (
  <div className="rounded-lg border border-utility-gray/60 bg-utility-gray/40 px-5 py-4">
    {children}
  </div>
);

const ProductDescription = ({
  productName,
  brandName,
  description,
  parsedColors = [],
  parsedSizes = [],
  isShoe = false,
}) => {
  const sections = parseDescriptionSections(description);
  const colorLines = sections.colors.length ? sections.colors : parsedColors;
  const sizeLines = sections.sizes.length ? sections.sizes : parsedSizes;
  const deliveryLines = sections.delivery.length
    ? sections.delivery
    : sections.footer.filter((l) => /delivery|dispatch|courier|fulfil|confirm/i.test(l));
  const whyLines = sections.why.length
    ? sections.why
    : sections.footer.filter((l) => /prince esquire|curated|support|pricing/i.test(l));
  const otherFooter = sections.footer.filter(
    (l) => !deliveryLines.includes(l) && !whyLines.includes(l)
  );

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-[9px] font-bold tracking-[0.28em] text-accent uppercase">Product Details</p>
        {brandName && <p className="text-[10px] text-accent/70 font-bold tracking-wider">{brandName}</p>}
        <h2 className="text-base md:text-lg font-serif font-bold text-secondary leading-snug tracking-tight">{productName}</h2>
      </div>

      <div className="space-y-5 text-[15px] font-semibold leading-[1.75] text-secondary">
        {sections.intro.map((para) => (
          <p key={para.slice(0, 48)} className="text-secondary/80">
            {para}
          </p>
        ))}
      </div>

      {sections.features.length > 0 && (
        <Section title="Key Features" icon="*">
          <ul className="space-y-3 pl-1 text-[15px] leading-relaxed text-secondary font-semibold">
            {sections.features.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-accent shrink-0 mt-1 font-bold">•</span>
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {colorLines.length > 0 && (
        <Section title="Available Color Variants" icon="*">
          <ul className="grid grid-cols-1 gap-2 pl-1 text-[14px] font-semibold text-secondary sm:grid-cols-2">
            {colorLines.map((c) => (
              <li key={c} className="flex items-center gap-2.5 border border-utility-gray/60 bg-utility-gray/30 px-3.5 py-2 rounded-lg">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="font-semibold">{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {sizeLines.length > 0 && (
        <Section title={isShoe ? 'Available Sizes (EU)' : 'Available Sizes'} icon="*">
          <Callout>
            <p className="text-[14px] font-semibold leading-relaxed text-secondary">
              {Array.isArray(sizeLines) ? sizeLines.join(', ') : sizeLines}
            </p>
            {isShoe && (
              <p className="mt-3 text-[12px] text-secondary/70 font-medium">
                Unisex fit suitable for men and women. Select your size above before adding to cart.
              </p>
            )}
          </Callout>
        </Section>
      )}

      <Section title="Delivery and Service" icon="*">
        <Callout>
          <ul className="space-y-2.5 text-[14px] font-semibold leading-relaxed text-secondary">
            {(deliveryLines.length ? deliveryLines : [
              'All orders are confirmed by our team before dispatch.',
              'Nairobi CBD and surrounding areas may qualify for in house rider delivery.',
              'Prepaid orders are shipped via your preferred courier nationwide.',
              'Fulfilment is subject to availability of your selected size and colour.',
            ]).map((line) => (
              <li key={line} className="flex gap-2.5">
                <span className="shrink-0 text-accent font-bold">•</span>
                <span className="font-semibold">{line}</span>
              </li>
            ))}
          </ul>
        </Callout>
      </Section>

      <Section title="Why ELIJAY'S Men's Wear" icon="*">
        <ul className="space-y-2.5 text-[14px] font-semibold text-secondary">
          {(whyLines.length ? whyLines : [
            'Curated luxury fashion with transparent pricing',
            'Fast, reliable delivery across Kenya',
            'In store availability at our Nairobi location',
            'Dedicated customer support before and after your purchase',
          ]).map((line) => (
            <li key={line} className="flex gap-2.5">
                <span className="shrink-0 text-accent font-bold">•</span>
                <span className="font-semibold">{line.replace(/^[-•]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </Section>

      {otherFooter.map((para) => (
        <p key={para.slice(0, 48)} className="text-[14px] font-semibold leading-relaxed text-secondary/80">{para}</p>
      ))}
    </div>
  );
};

export default ProductDescription;
