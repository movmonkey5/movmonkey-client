import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";

export default function Drawer({
  open,
  setOpen,
  children,
  title,
  side = "left",
}) {
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={`pointer-events-none fixed inset-y-0 ${
                  side === "right" ? "right-0" : "left-0"
                }  flex max-w-full`}
              >
                <Transition.Child
                  as={"div"}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom={
                    side === "right" ? "translate-x-full" : "-translate-x-full"
                  }
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo={
                    side === "right" ? "translate-x-full" : "-translate-x-full"
                  }
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-xs sm:max-w-md">
                    <div className="flex h-screen flex-col bg-white shadow-xl">
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="px-4 py-2.5 bg-secondary">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-xl font-semibold text-white">
                              {title}
                            </Dialog.Title>

                            <div className="ml-5 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md text-white focus:outline-none focus:ring-0"
                                onClick={() => setOpen(false)}
                              >
                                <svg
                                  className="h-8 w-8 focus:outline-none focus:ring-0"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-4 ">{children}</div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
