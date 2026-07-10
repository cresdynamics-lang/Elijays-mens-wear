import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { parseDescriptionSections } from '../../utils/productDescription';

const AccordionPanel = ({ id, title, open, onToggle, children }) => (
  <div className="border-b border-elijays-ink/10">
    <button
      type="button"
      onClick={() => onToggle(id)}
      aria-expanded={open}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <span className="text-[12px] font-medium tracking-[0.1em] uppercase text-elijays-ink">
        {title}
      </span>
      <ChevronDown
        size={16}
        className={`text-elijays-gold transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      />
    </button>
    {open && (
      <div className="pb-5 text-sm text-[#5c5c5c] font-light leading-relaxed space-y-3">
        {children}
      </div>
    )}
  </div>
);

const ProductDescription = ({
  productName,
  brandName,
  description,
  parsedColors = [],
  parsedSizes = [],
  isShoe = false,
  keyFeatures = [],
}) => {
  const [openId, setOpenId] = useState('fabric');
  const sections = parseDescriptionSections(description);
  const colorLines = sections.colors.length ? sections.colors : parsedColors;
  const sizeLines = sections.sizes.length ? sections.sizes : parsedSizes;
  const deliveryLines = sections.delivery.length
    ? sections.delivery
    : sections.footer.filter((l) => /delivery|dispatch|courier|fitting|confirm/i.test(l));
  const featuresToShow = keyFeatures.length > 0 ? keyFeatures : sections.features;

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-6">
      {(sections.intro.length > 0 || brandName) && (
        <div className="space-y-2">
          {brandName && (
            <p className="text-[11px] tracking-[0.12em] uppercase text-elijays-gold">{brandName}</p>
          )}
          {sections.intro.map((para) => (
            <p key={para.slice(0, 48)} className="text-sm text-[#5c5c5c] font-light leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      )}

      <div className="border-t border-elijays-ink/10">
        <AccordionPanel id="fabric" title="Fabric & Care" open={openId === 'fabric'} onToggle={toggle}>
          {featuresToShow.length > 0 ? (
            <ul className="space-y-2">
              {featuresToShow.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          ) : (
            <p>
              Premium cloth selected for Nairobi wear — ask in-store or on WhatsApp for fabric details on {productName}.
            </p>
          )}
          {colorLines.length > 0 && (
            <p className="pt-1">Colours: {colorLines.join(', ')}</p>
          )}
        </AccordionPanel>

        <AccordionPanel id="fit" title="Fit Guide" open={openId === 'fit'} onToggle={toggle}>
          {sizeLines.length > 0 ? (
            <p>
              Available {isShoe ? 'EU sizes' : 'sizes'}:{' '}
              {Array.isArray(sizeLines) ? sizeLines.join(', ') : sizeLines}.
            </p>
          ) : (
            <p>Select your size above. Unsure? Book a fitting on Muindi Mbingu or enquire on WhatsApp.</p>
          )}
          <p>
            Prefer to feel the garment? Walk into Elijay&apos;s at Muindi Mbingu × Biashara — we&apos;ll size you on the floor.
          </p>
        </AccordionPanel>

        <AccordionPanel
          id="delivery"
          title="Delivery & Fitting"
          open={openId === 'delivery'}
          onToggle={toggle}
        >
          <ul className="space-y-2">
            {(deliveryLines.length
              ? deliveryLines
              : [
                  'Enquire on WhatsApp to confirm size and stock before you commit.',
                  'Collect in store on Muindi Mbingu × Biashara, or arrange delivery across Nairobi.',
                  'Fitting appointments available during store hours — Mon–Sat 9:00 AM – 6:00 PM.',
                ]
            ).map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </AccordionPanel>
      </div>
    </div>
  );
};

export default ProductDescription;
