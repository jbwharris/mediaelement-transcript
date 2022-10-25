'use strict';

/**
 * transcript plugin
 *
 * This adds a transcript download button to the player
 * To activate it, one of the nodes contained in the `<video>` or `<audio>` tag must be
 * `<link href="/path/to/transcript" rel="transcript">`
 */
Object.assign(MediaElementPlayer.prototype, {

    /**
     * Feature constructor.
     *
     * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
     * @param {MediaElementPlayer} player
     * @param {HTMLElement} controls
     * @param {HTMLElement} layers
     */
    buildtranscript(player, controls, layers, media) {
        const transcripts = this.domNode.querySelectorAll('link[rel="transcript"]');

        if (transcripts.length > 0) {
            let control = document.createElement('div');
            control.classList.add('mejs__button', 'mejs__transcript');

            let button = document.createElement('button');
            button.setAttribute('title', 'Download Transcript');
            button.setAttribute('aria-label', 'Download Transcript');
            control.appendChild(button);

            let container = document.createElement('div');
            container.classList.add('mejs__transcript-container');
            control.appendChild(container);

            control.addEventListener('mouseenter', function () {
                container.classList.add('show');
            });

            control.addEventListener('mouseleave', function () {
                container.classList.remove('show');
            });

            control.addEventListener('focusin', function () {
                container.classList.add('show');
            });

            control.addEventListener('focusout', function (e) {
                if (e.relatedTarget) {
                    if (!this.contains(e.relatedTarget)) {
                        container.classList.remove('show');
                    }
                } else {
                    container.classList.remove('show');
                }
            });

            this.transcripts = [];
            for (const transcript of transcripts) {
                if (transcript.getAttribute('src')) {
                    let link = document.createElement('a');
                    link.setAttribute('href', transcript.getAttribute('src'));
                    link.setAttribute('download', '');
                    link.setAttribute('for', transcript.getAttribute('for'));
                    link.textContent = transcript.getAttribute('label');
                    link.classList.add('mejs__transcript-url');
                    this.transcripts.push(link);
                }
            }

            const sources = media.querySelectorAll('source');
            if (sources.length >= 2) {
                for (const source of sources) {
                    const list = document.createElement('ul');
                    list.classList.add('mejs__transcript-list');
                    list.setAttribute('for', source.getAttribute('src'));

                    for (const transcript of this.transcripts) {
                        if (transcript.getAttribute('for') === list.getAttribute('for')) {
                            const wrapper = document.createElement('li');
                            wrapper.appendChild(transcript);
                            list.appendChild(wrapper);
                        }
                    }

                    container.appendChild(list);
                }

                media.addEventListener('play', () => {
                    const selected = layers.querySelector('.mejs__playlist-layer > .mejs__playlist-selector-list > .mejs__playlist-selected');

                    if (selected) {
                        const active = selected.querySelector('input[type="radio"]').getAttribute('value');

                        for (const list of container.querySelectorAll('.mejs__transcript-list')) {
                            if (list.getAttribute('for') === active) {
                                list.classList.add('active');

                                if (list.children.length === 0) {
                                    control.classList.add('no-transcripts');
                                } else {
                                    control.classList.remove('no-transcripts');
                                }
                            } else {
                                list.classList.remove('active');
                            }
                        }
                    }
                });

            } else {
                const list = document.createElement('ul');
                list.classList.add('mejs__transcript-list');
                list.classList.add('active');

                for (const transcript of this.transcripts) {
                    const wrapper = document.createElement('li');
                    wrapper.appendChild(transcript);
                    list.appendChild(wrapper);
                }

                container.appendChild(list);
            }

            controls.appendChild(control);
        };
    }
});