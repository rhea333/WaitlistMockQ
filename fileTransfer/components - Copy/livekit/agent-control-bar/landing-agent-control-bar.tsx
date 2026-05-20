'use client';

import { type HTMLAttributes } from 'react';
import { Track } from 'livekit-client';
import { PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/livekit/button';
import { cn } from '@/lib/utils';
import { UseInputControlsProps, useInputControls } from './hooks/use-input-controls';
import { TrackSelector } from './track-selector';

export interface LandingAgentControlBarProps extends UseInputControlsProps {
  isConnected?: boolean;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

/**
 * A simplified control bar for the landing page mockup without camera and chat toggles
 */
export function LandingAgentControlBar({
  saveUserChoices = true,
  className,
  isConnected = false,
  onDisconnect,
  onDeviceError,
  ...props
}: LandingAgentControlBarProps & HTMLAttributes<HTMLDivElement>) {
  const {
    micTrackRef,
    microphoneToggle,
    handleAudioDeviceChange,
    handleMicrophoneDeviceSelectError,
  } = useInputControls({ onDeviceError, saveUserChoices });

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn(
        'bg-background border-input/50 dark:border-muted flex flex-col rounded-[31px] border p-3 drop-shadow-md/3',
        className
      )}
      {...props}
    >
      <div className="flex gap-1">
        <div className="flex grow gap-1">
          {/* Toggle Microphone */}
          <TrackSelector
            kind="audioinput"
            aria-label="Toggle microphone"
            source={Track.Source.Microphone}
            pressed={microphoneToggle.enabled}
            disabled={microphoneToggle.pending}
            audioTrackRef={micTrackRef}
            onPressedChange={microphoneToggle.toggle}
            onMediaDeviceError={handleMicrophoneDeviceSelectError}
            onActiveDeviceChange={handleAudioDeviceChange}
          />
        </div>

        {/* Disconnect */}
        <Button
          variant="destructive"
          onClick={onDisconnect}
          disabled={!isConnected}
          className="font-mono"
        >
          <PhoneDisconnectIcon weight="bold" />
          <span className="hidden md:inline">END CALL</span>
          <span className="inline md:hidden">END</span>
        </Button>
      </div>
    </div>
  );
}
